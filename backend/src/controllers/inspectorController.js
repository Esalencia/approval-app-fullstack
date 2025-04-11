import {
  getAllInspectorsService,
  getInspectorByIdService,
  createInspectorService,
  updateInspectorService,
  deleteInspectorService
} from '../models/inspectorModel.js';

// Helper function for error responses
const errorResponse = (res, statusCode, message) => {
  return res.status(statusCode).json({
      status: statusCode >= 500 ? 'error' : 'fail',
      message
  });
};

export const getAllInspectors = async (req, res) => {
  try {
      const inspectors = await getAllInspectorsService();
      res.status(200).json({
          status: 'success',
          results: inspectors.length,
          data: { inspectors }
      });
  } catch (err) {
      errorResponse(res, 500, err.message);
  }
};

export const getInspector = async (req, res) => {
  try {
      const { id } = req.params;
      const inspector = await getInspectorByIdService(id);
      
      if (!inspector) {
          return errorResponse(res, 404, 'Inspector not found');
      }

      res.status(200).json({
          status: 'success',
          data: { inspector }
      });
  } catch (err) {
      errorResponse(res, 500, err.message);
  }
};

export const createInspector = async (req, res) => {
  try {
      const { 
          first_name,
          last_name,
          national_id_number,
          email,
          password,
          contact_number,
          work_id,
          license_number,
          specialization,
          available = true,
          assigned_district,
          inspection_type
      } = req.body;

      // Basic validation
      if (!email || !password || !work_id) {
          return errorResponse(res, 400, 'Email, password and work ID are required');
      }

      const newInspector = await createInspectorService({
          first_name,
          last_name,
          national_id_number,
          email,
          password, // Note: Service should hash this password
          contact_number,
          work_id,
          license_number,
          specialization,
          available,
          assigned_district,
          inspection_type
      });

      res.status(201).json({
          status: 'success',
          data: { inspector: newInspector }
      });
  } catch (err) {
      errorResponse(res, 400, err.message);
  }
};

export const updateInspector = async (req, res) => {
  try {
      const { id } = req.params;
      const updateData = req.body;

      // Remove password from update if present (should have separate endpoint for password changes)
      if (updateData.password) {
          delete updateData.password;
      }

      const updatedInspector = await updateInspectorService(id, updateData);

      if (!updatedInspector) {
          return errorResponse(res, 404, 'Inspector not found');
      }

      res.status(200).json({
          status: 'success',
          data: { inspector: updatedInspector }
      });
  } catch (err) {
      errorResponse(res, 400, err.message);
  }
};

export const deleteInspector = async (req, res) => {
  try {
      const { id } = req.params;
      const deletedInspector = await deleteInspectorService(id);

      if (!deletedInspector) {
          return errorResponse(res, 404, 'Inspector not found');
      }

      res.status(204).end();
  } catch (err) {
      errorResponse(res, 500, err.message);
  }
};