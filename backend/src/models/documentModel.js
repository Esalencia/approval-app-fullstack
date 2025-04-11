import pool from '../config/db.js';
import { extractTextFromBuffer } from '../services/ocrService.js';
import { extractDimensions, extractAreas, extractFloorCount } from '../utils/extractors.js';
import { checkOpenAICompliance } from '../services/aiService.js';
import BUILDING_STANDARDS from '../data/buildingStandards.js';

class DocumentModel {
  // ==================== DOCUMENT CRUD OPERATIONS ====================

  async create({ 
    userId, 
    file, 
    applicationId = null, 
    categoryId = null,
    status = 'pending'
  }) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Extract text if it's a PDF or image
      let extractedText = '';
      if (file.mimetype === 'application/pdf' || file.mimetype.startsWith('image/')) {
        extractedText = await extractTextFromBuffer(file.buffer, file.mimetype);
      }

      const result = await client.query(
        `INSERT INTO documents (
          user_id, application_id, category_id,
          file_name, file_type, file_size,
          file_data, extracted_text, status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING id, file_name, file_type, file_size, created_at, status`,
        [
          userId, applicationId, categoryId,
          file.originalname, file.mimetype, file.size,
          file.buffer, extractedText, status
        ]
      );

      await client.query('COMMIT');
      return result.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async findById(id, includeFileData = false) {
    const columns = includeFileData 
      ? '*' 
      : `id, user_id, file_name, file_type, file_size, 
         extracted_text, created_at, application_id, 
         category_id, status, compliance_result`;

    const result = await pool.query(
      `SELECT ${columns} FROM documents WHERE id = $1`,
      [id]
    );
    return result.rows[0] || null;
  }

  async findByUserId(userId) {
    const result = await pool.query(
      `SELECT id, file_name, file_type, file_size, 
              created_at, application_id, category_id, status
       FROM documents 
       WHERE user_id = $1 
       ORDER BY created_at DESC`,
      [userId]
    );
    return result.rows;
  }

  async getFileBuffer(id) {
    const result = await pool.query(
      'SELECT file_data, file_type, file_name FROM documents WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  }

  async delete(id) {
    await pool.query('DELETE FROM documents WHERE id = $1', [id]);
    return true;
  }

  // ==================== DOCUMENT REVIEW OPERATIONS ====================

  async addReview({ documentId, reviewerId, comments, status }) {
    const result = await pool.query(
      `INSERT INTO document_reviews
       (document_id, reviewer_id, comments, status)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [documentId, reviewerId, comments, status]
    );
    return result.rows[0];
  }

  async getReviews(documentId) {
    const result = await pool.query(
      `SELECT dr.*, u.name as reviewer_name
       FROM document_reviews dr
       JOIN users u ON dr.reviewer_id = u.id
       WHERE document_id = $1
       ORDER BY created_at DESC`,
      [documentId]
    );
    return result.rows;
  }

  // ==================== COMPLIANCE OPERATIONS ====================

  async checkCompliance(documentId) {
    const doc = await this.findById(documentId);
    if (!doc || !doc.extracted_text) {
      throw new Error('Document text not available for compliance check');
    }

    const basicIssues = this.performRuleBasedChecks(doc.extracted_text);
    const aiIssues = await checkOpenAICompliance(doc.extracted_text);
    
    const complianceResult = {
      compliant: basicIssues.length === 0 && aiIssues.length === 0,
      issues: [...basicIssues, ...aiIssues],
      textExtracted: doc.extracted_text.length > 500 
        ? doc.extracted_text.substring(0, 500) + "..." 
        : doc.extracted_text
    };

    // Save compliance result
    await pool.query(
      'UPDATE documents SET compliance_result = $1 WHERE id = $2',
      [complianceResult, documentId]
    );

    return complianceResult;
  }

  performRuleBasedChecks(text) {
    const issues = [];
    const heights = extractDimensions(text);
    const areas = extractAreas(text);
    const storeys = extractFloorCount(text);

    // Check heights
    const minHabitable = BUILDING_STANDARDS.clear_height.habitable_rooms;
    const minNonHabitable = BUILDING_STANDARDS.clear_height.non_habitable_rooms;
    
    heights.forEach(height => {
      if (0.5 < height && height < minNonHabitable) {
        issues.push(`Found room height of ${height}m, which is below minimum non-habitable room height of ${minNonHabitable}m`);
      } else if (minNonHabitable <= height && height < minHabitable) {
        issues.push(`Found room height of ${height}m, which may be acceptable for non-habitable rooms but is below minimum habitable room height of ${minHabitable}m`);
      }
    });

    // Check areas
    const minArea = BUILDING_STANDARDS.floor_area.habitable_rooms_min;
    areas.forEach(area => {
      if (1 < area && area < minArea) {
        issues.push(`Found room area of ${area} sq m, which is below minimum habitable room area of ${minArea} sq m`);
      }
    });

    // Check storeys
    const maxDwelling = BUILDING_STANDARDS.height_requirements.max_dwelling_storeys;
    const maxResidential = BUILDING_STANDARDS.height_requirements.max_residential_storeys;
    
    storeys.forEach(storey => {
      if (storey > maxResidential) {
        issues.push(`Found ${storey} storeys, which exceeds maximum residential building height of ${maxResidential} storeys`);
      } else if (storey > maxDwelling) {
        issues.push(`Found ${storey} storeys, which exceeds maximum dwelling house height of ${maxDwelling} storeys. This requires Grade B construction.`);
      }
    });

    // Check for required sections
    const lowerText = text.toLowerCase();
    if (!lowerText.includes('ventilation') && !lowerText.includes('opening')) {
      issues.push("No clear mention of ventilation requirements in the document");
    }

    if (!lowerText.includes('fire') && !lowerText.includes('non-combustible') && !lowerText.includes('fire-resistant')) {
      issues.push("No clear mention of fire safety requirements in the document");
    }

    return issues;
  }

  // ==================== STATUS MANAGEMENT ====================

  async updateStatus(id, status, rejectionReason = null) {
    const result = await pool.query(
      `UPDATE documents 
       SET status = $1, 
           rejection_reason = $2,
           updated_at = NOW()
       WHERE id = $3
       RETURNING id, status, updated_at`,
      [status, rejectionReason, id]
    );
    return result.rows[0];
  }
}

export default new DocumentModel();