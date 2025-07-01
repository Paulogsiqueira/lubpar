import { defineStore } from 'pinia'
import { ref } from 'vue'
import { prospectService } from '../services/prospectService'

export const useProspectsStore = defineStore('prospects', () => {
  const prospects = ref([])
  const currentProspect = ref(null)
  const loading = ref(false)
  const filters = ref({
    search: '',
    status: '',
    segment: '',
    dateFrom: null,
    dateTo: null
  })

  const fetchProspects = async () => {
    loading.value = true
    try {
      const response = await prospectService.getProspects(filters.value)
      prospects.value = response.data
    } catch (error) {
      console.error('Error fetching prospects:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const getProspect = async (id) => {
    loading.value = true
    try {
      const response = await prospectService.getProspect(id)
      currentProspect.value = response.data
      return response.data
    } catch (error) {
      console.error('Error fetching prospect:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const createProspect = async (prospectData) => {
    loading.value = true
    try {
      const response = await prospectService.createProspect(prospectData)
      prospects.value.push(response.data)
      return response.data
    } catch (error) {
      console.error('Error creating prospect:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const updateProspect = async (id, prospectData) => {
    loading.value = true
    try {
      const response = await prospectService.updateProspect(id, prospectData)
      const index = prospects.value.findIndex(p => p.id === id)
      if (index !== -1) {
        prospects.value[index] = response.data
      }
      currentProspect.value = response.data
      return response.data
    } catch (error) {
      console.error('Error updating prospect:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const deleteProspect = async (id) => {
    loading.value = true
    try {
      await prospectService.deleteProspect(id)
      prospects.value = prospects.value.filter(p => p.id !== id)
    } catch (error) {
      console.error('Error deleting prospect:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const setFilters = (newFilters) => {
    filters.value = { ...filters.value, ...newFilters }
  }

  const clearFilters = () => {
    filters.value = {
      search: '',
      status: '',
      segment: '',
      dateFrom: null,
      dateTo: null
    }
  }

  return {
    prospects,
    currentProspect,
    loading,
    filters,
    fetchProspects,
    getProspect,
    createProspect,
    updateProspect,
    deleteProspect,
    setFilters,
    clearFilters
  }
})