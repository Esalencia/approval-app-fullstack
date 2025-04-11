import { ErrorResponse } from '../utils/errorResponse.js';
import DocumentModel from '../models/documentModel.js';

export const uploadDocument = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(new ErrorResponse('No file uploaded', 400));
    }

    const document = await DocumentModel.create({
      userId: req.user.id,
      file: req.file,
      applicationId: req.body.applicationId || null,
      categoryId: req.body.categoryId || null
    });

    res.status(201).json({
      success: true,
      data: document
    });
  } catch (error) {
    next(error);
  }
};

export const getDocument = async (req, res, next) => {
  try {
    const { id } = req.params;
    const document = await DocumentModel.findById(id);
    
    if (!document) {
      return next(new ErrorResponse('Document not found', 404));
    }

    if (document.user_id !== req.user.id) {
      return next(new ErrorResponse('Not authorized to access this document', 403));
    }

    res.json({
      success: true,
      data: {
        id: document.id,
        fileName: document.file_name,
        fileType: document.file_type,
        fileSize: document.file_size,
        createdAt: document.created_at,
        status: document.status,
        applicationId: document.application_id,
        categoryId: document.category_id,
        extractedText: document.extracted_text,
        complianceResult: document.compliance_result
      }
    });
  } catch (error) {
    next(error);
  }
};

export const checkCompliance = async (req, res, next) => {
  try {
    const { id } = req.params;
    const document = await DocumentModel.findById(id);
    
    if (!document) {
      return next(new ErrorResponse('Document not found', 404));
    }

    if (document.user_id !== req.user.id) {
      return next(new ErrorResponse('Not authorized to access this document', 403));
    }

    const result = await DocumentModel.checkCompliance(id);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const downloadDocument = async (req, res, next) => {
  try {
    const { id } = req.params;
    const fileData = await DocumentModel.getFileBuffer(id);
    
    if (!fileData) {
      return next(new ErrorResponse('Document not found', 404));
    }

    const document = await DocumentModel.findById(id);
    if (document.user_id !== req.user.id) {
      return next(new ErrorResponse('Not authorized to access this document', 403));
    }

    res.setHeader('Content-Type', fileData.file_type);
    res.setHeader('Content-Disposition', `attachment; filename="${fileData.file_name}"`);
    res.send(fileData.file_data);
  } catch (error) {
    next(error);
  }
};

export const getUserDocuments = async (req, res, next) => {
  try {
    const documents = await DocumentModel.findByUserId(req.user.id);
    res.json({
      success: true,
      count: documents.length,
      data: documents
    });
  } catch (error) {
    next(error);
  }
};

export const deleteDocument = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const document = await DocumentModel.findById(id);
    if (!document) {
      return next(new ErrorResponse('Document not found', 404));
    }
    if (document.user_id !== req.user.id) {
      return next(new ErrorResponse('Not authorized to delete this document', 403));
    }

    await DocumentModel.delete(id);
    res.json({ 
      success: true, 
      data: {} 
    });
  } catch (error) {
    next(error);
  }
};

export const addReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { comments, status } = req.body;
    
    const document = await DocumentModel.findById(id);
    if (!document) {
      return next(new ErrorResponse('Document not found', 404));
    }

    // Check if reviewer is different from document owner
    if (document.user_id === req.user.id) {
      return next(new ErrorResponse('Cannot review your own document', 400));
    }

    const review = await DocumentModel.addReview({
      documentId: id,
      reviewerId: req.user.id,
      comments,
      status
    });

    // Update document status if changed
    if (status !== 'needs_revision') {
      await DocumentModel.updateStatus(id, status);
    }

    res.status(201).json({
      success: true,
      data: review
    });
  } catch (error) {
    next(error);
  }
};

export const getDocumentReviews = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const document = await DocumentModel.findById(id);
    if (!document) {
      return next(new ErrorResponse('Document not found', 404));
    }

    if (document.user_id !== req.user.id && !req.user.roles.includes('admin')) {
      return next(new ErrorResponse('Not authorized to view these reviews', 403));
    }

    const reviews = await DocumentModel.getReviews(id);
    res.json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    next(error);
  }
};

export const updateDocumentStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, rejectionReason } = req.body;
    
    const document = await DocumentModel.findById(id);
    if (!document) {
      return next(new ErrorResponse('Document not found', 404));
    }

    // Only admin or document owner can update status
    if (document.user_id !== req.user.id && !req.user.roles.includes('admin')) {
      return next(new ErrorResponse('Not authorized to update this document', 403));
    }

    const updatedDoc = await DocumentModel.updateStatus(id, status, rejectionReason);
    res.json({
      success: true,
      data: updatedDoc
    });
  } catch (error) {
    next(error);
  }
};