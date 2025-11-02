// useSharedProperties.js
// Estado compartido para propiedades entre ChatBox y lista principal
import { ref, readonly } from 'vue'

// Estado global compartido
const sharedProperties = ref([])
const lastChatSearchResults = ref([])
const shouldUpdateFromChat = ref(false)
const chatUpdateCounter = ref(0) // Contador para forzar reactividad
const hasUserInteraction = ref(false) // Indica si hubo interacción real del usuario

export function useSharedProperties() {
  // Para búsquedas del usuario (mostrar banner)
  const updatePropertiesFromChat = (properties, isUserSearch = false) => {
    if (properties && properties.length > 0) {
      lastChatSearchResults.value = properties
      sharedProperties.value = properties
      shouldUpdateFromChat.value = isUserSearch // Solo activar banner si es búsqueda del usuario
      hasUserInteraction.value = isUserSearch
      chatUpdateCounter.value++ // Incrementar cada vez que llegan resultados
      
      console.log(`📋 Propiedades actualizadas desde ChatBox: ${properties.length} resultados (búsqueda usuario: ${isUserSearch}, actualización #${chatUpdateCounter.value})`)
    }
  }

  const clearChatResults = () => {
    lastChatSearchResults.value = []
    shouldUpdateFromChat.value = false
    hasUserInteraction.value = false
    chatUpdateCounter.value = 0
  }

  const mergeWithChatResults = (dbProperties) => {
    // Si hay resultados del chat activos Y hubo interacción del usuario, usarlos
    if (shouldUpdateFromChat.value && hasUserInteraction.value && lastChatSearchResults.value.length > 0) {
      console.log(`🔄 Mostrando resultados del ChatBox en lista principal`)
      return lastChatSearchResults.value
    }
    // Si no, usar las propiedades de la BD
    return dbProperties
  }

  return {
    sharedProperties: readonly(sharedProperties),
    lastChatSearchResults: readonly(lastChatSearchResults),
    shouldUpdateFromChat: readonly(shouldUpdateFromChat),
    chatUpdateCounter: readonly(chatUpdateCounter),
    hasUserInteraction: readonly(hasUserInteraction),
    updatePropertiesFromChat,
    clearChatResults,
    mergeWithChatResults
  }
}
