// usePropertyService.js
// Composable para gestión de propiedades (Single Responsibility Principle)
import { ref, readonly } from 'vue'
import { propertyApiService } from './propertyApiService'

export function usePropertyService() {
  const properties = ref([])
  const currentProperty = ref(null)
  const isLoading = ref(false)
  const error = ref(null)

  const loadProperties = async () => {
    isLoading.value = true
    error.value = null
    try {
      const data = await propertyApiService.getAll()
      properties.value = data
    } catch (err) {
      error.value = err.message
      console.error('Error loading properties:', err)
    } finally {
      isLoading.value = false
    }
  }

  const loadProperty = async (id) => {
    isLoading.value = true
    error.value = null
    try {
      const data = await propertyApiService.getById(id)
      currentProperty.value = data
    } catch (err) {
      error.value = err.message
      console.error(`Error loading property ${id}:`, err)
    } finally {
      isLoading.value = false
    }
  }

  const createProperty = async (propertyData) => {
    isLoading.value = true
    error.value = null
    try {
      const newProperty = await propertyApiService.create(propertyData)
      properties.value.unshift(newProperty)
      return newProperty
    } catch (err) {
      error.value = err.message
      console.error('Error creating property:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const updateProperty = async (id, propertyData) => {
    isLoading.value = true
    error.value = null
    try {
      const updated = await propertyApiService.update(id, propertyData)
      const index = properties.value.findIndex(p => p.id === id)
      if (index !== -1) {
        properties.value[index] = updated
      }
      return updated
    } catch (err) {
      error.value = err.message
      console.error(`Error updating property ${id}:`, err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const deleteProperty = async (id) => {
    isLoading.value = true
    error.value = null
    try {
      await propertyApiService.delete(id)
      properties.value = properties.value.filter(p => p.id !== id)
    } catch (err) {
      error.value = err.message
      console.error(`Error deleting property ${id}:`, err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    // Estado (readonly para encapsulación)
    properties: readonly(properties),
    currentProperty: readonly(currentProperty),
    isLoading: readonly(isLoading),
    error: readonly(error),
    
    // Métodos
    loadProperties,
    loadProperty,
    createProperty,
    updateProperty,
    deleteProperty
  }
}
