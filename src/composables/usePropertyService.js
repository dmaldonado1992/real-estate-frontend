// usePropertyService.js
// Composable para gestión de propiedades (Single Responsibility Principle)
import { ref, readonly } from 'vue'
import { propertyApiService } from './propertyApiService'
import { useSharedProperties } from './useSharedProperties'

export function usePropertyService() {
  const properties = ref([])
  const currentProperty = ref(null)
  const isLoading = ref(false)
  const error = ref(null)
  
  // Integrar estado compartido del ChatBox
  const { mergeWithChatResults, clearChatResults } = useSharedProperties()

  const loadProperties = async () => {
    isLoading.value = true
    error.value = null
    try {
      console.log('🔄 Cargando propiedades desde el backend...')
      // El backend ya implementa fallback a JSON automáticamente
      // cuando la BD está vacía, así que solo necesitamos una llamada
      const data = await propertyApiService.getAll()
      
      // El backend puede devolver data.products o directamente un array
      const dbProperties = Array.isArray(data) ? data : (data.products || data || [])
      
      // Fusionar con resultados del ChatBox si los hay
      properties.value = mergeWithChatResults(dbProperties)
      
      if (properties.value.length > 0) {
        console.log(`✅ Cargadas ${properties.value.length} propiedades (BD o JSON fallback)`)
      } else {
        console.log('⚠️ No hay propiedades disponibles')
      }
    } catch (err) {
      error.value = err.message
      console.error('❌ Error loading properties:', err)
      properties.value = []
    } finally {
      isLoading.value = false
    }
  }
  
  const resetToAllProperties = async () => {
    // Limpiar resultados del chat y recargar todas las propiedades
    clearChatResults()
    await loadProperties()
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
      // Recargar todas las propiedades desde el backend para asegurar sincronización
      await loadProperties()
      console.log('✅ Propiedad eliminada y lista recargada')
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
    deleteProperty,
    resetToAllProperties
  }
}
