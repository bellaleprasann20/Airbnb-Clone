import api from './api';

export const invoiceService = {
  getInvoice: (bookingId) => api.get(`/invoices/${bookingId}`),
  
  downloadReceipt: async (bookingId) => {
    const response = await api.get(`/invoices/${bookingId}/download`, {
      responseType: 'blob' // Important for file downloads
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `receipt-${bookingId}.pdf`);
    document.body.appendChild(link);
    link.click();
  }
};