import { defineStore } from 'pinia'
import { ref } from 'vue'
import { trackingService } from '../services/trackingService'

export const useTrackingStore = defineStore('tracking', () => {
  const trackingData = ref([])
  const orderTracking = ref(null)
  const loading = ref(false)

  const searchTracking = async (searchParams) => {
    loading.value = true
    try {
      const response = await trackingService.searchTracking(searchParams)
      trackingData.value = response.data
      return response.data
    } catch (error) {
      console.error('Error searching tracking:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const getOrderTracking = async (orderId) => {
    loading.value = true
    try {
      const response = await trackingService.getOrderTracking(orderId)
      orderTracking.value = response.data
      return response.data
    } catch (error) {
      console.error('Error fetching order tracking:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const updateTrackingStatus = async (trackingId, status) => {
    loading.value = true
    try {
      const response = await trackingService.updateStatus(trackingId, status)
      // Update local data
      const index = trackingData.value.findIndex(t => t.id === trackingId)
      if (index !== -1) {
        trackingData.value[index] = response.data
      }
      return response.data
    } catch (error) {
      console.error('Error updating tracking status:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  return {
    trackingData,
    orderTracking,
    loading,
    searchTracking,
    getOrderTracking,
    updateTrackingStatus
  }
})