import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '../services/authService'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('token'))
  const loading = ref(false)

  const isAuthenticated = computed(() => !!token.value)

  const login = async (credentials) => {
    loading.value = true
    try {
      const response = await authService.login(credentials)
      
      // Ajustar conforme a estrutura de resposta da API Java
      user.value = response.usuario || response.user
      token.value = response.token || response.accessToken
      
      localStorage.setItem('token', token.value)
      if (credentials.remember) {
        localStorage.setItem('user', JSON.stringify(user.value))
      }
      
      return response
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    try {
      await authService.logout()
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    } finally {
      user.value = null
      token.value = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
  }

  const checkAuth = async () => {
    if (!token.value) return false
    
    try {
      const response = await authService.validateToken()
      user.value = response.usuario || response.user
      return true
    } catch (error) {
      logout()
      return false
    }
  }

  // Inicializar usuário do localStorage se existir
  const initializeAuth = () => {
    const savedUser = localStorage.getItem('user')
    if (savedUser && token.value) {
      try {
        user.value = JSON.parse(savedUser)
      } catch (error) {
        console.error('Erro ao carregar usuário salvo:', error)
        localStorage.removeItem('user')
      }
    }
  }

  return {
    user,
    token,
    loading,
    isAuthenticated,
    login,
    logout,
    checkAuth,
    initializeAuth
  }
})