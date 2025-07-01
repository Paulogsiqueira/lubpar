import api from './api'

export const authService = {
  async login(credentials) {
    const response = await api.post('/auth/login', {
      login: credentials.login,
      senha: credentials.password
    })
    return response.data
  },

  async logout() {
    const response = await api.post('/auth/logout')
    return response.data
  },

  async validateToken() {
    const response = await api.get('/auth/validate')
    return response.data
  },

  async refreshToken() {
    const response = await api.post('/auth/refresh')
    return response.data
  }
}