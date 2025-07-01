import api from './api'

export const prospectService = {
  async getProspects(filters = {}) {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value)
    })
    
    const response = await api.get(`/prospects?${params}`)
    return response.data
  },

  async getProspect(id) {
    const response = await api.get(`/prospects/${id}`)
    return response.data
  },

  async createProspect(prospectData) {
    const response = await api.post('/prospects', prospectData)
    return response.data
  },

  async updateProspect(id, prospectData) {
    const response = await api.put(`/prospects/${id}`, prospectData)
    return response.data
  },

  async deleteProspect(id) {
    const response = await api.delete(`/prospects/${id}`)
    return response.data
  },

  async getSegments() {
    const response = await api.get('/prospects/segments')
    return response.data
  },

  async getStatuses() {
    const response = await api.get('/prospects/statuses')
    return response.data
  }
}