import api from './api';

export const propertyService = {
  getAll: (params) => api.get('/properties', { params }),
  
  getById: (id) => api.get(`/properties/${id}`),
  
  create: (propertyData) => api.post('/host/properties', propertyData),
  
  update: (id, updateData) => api.patch(`/host/properties/${id}`, updateData),
  
  delete: (id) => api.delete(`/host/properties/${id}`),

  // Admin specific
  verifyProperty: (id) => api.patch(`/admin/properties/${id}/verify`)
};