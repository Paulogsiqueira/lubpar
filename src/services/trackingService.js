import api from './api'

export const trackingService = {
  async searchTracking(searchParams) {
    const response = await api.post('/tracking/search', {
      numeroPedido: searchParams.orderNumber,
      cpfCnpj: searchParams.document,
      dataInicio: searchParams.dateFrom,
      dataFim: searchParams.dateTo
    })
    return response.data
  },

  async getOrderTracking(orderId) {
    const response = await api.get(`/tracking/pedido/${orderId}`)
    return response.data
  },

  async updateStatus(trackingId, status) {
    const response = await api.put(`/tracking/${trackingId}/status`, { status })
    return response.data
  },

  async getTrackingHistory(trackingId) {
    const response = await api.get(`/tracking/${trackingId}/historico`)
    return response.data
  }
}