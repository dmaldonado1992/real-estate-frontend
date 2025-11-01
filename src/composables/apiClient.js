// apiClient.js
// Cliente HTTP genérico (Open/Closed Principle)
// Abierto para extensión, cerrado para modificación

const API_BASE_URL = 'http://localhost:8000'

// Mensajes de error amigables para el usuario
const FRIENDLY_ERROR_MESSAGES = {
  NETWORK: 'No se pudo conectar con el servidor. Por favor, verifica tu conexión a internet.',
  SERVER: 'El servicio no está disponible en este momento. Por favor, intenta de nuevo más tarde.',
  NOT_FOUND: 'El recurso solicitado no se encuentra disponible.',
  UNAUTHORIZED: 'No tienes permisos para realizar esta acción.',
  VALIDATION: 'Los datos ingresados no son válidos. Por favor, revisa la información.',
  DEFAULT: 'Ocurrió un error inesperado. Por favor, intenta de nuevo.'
}

class ApiClient {
  constructor(baseURL) {
    this.baseURL = baseURL
  }

  // Convertir errores técnicos a mensajes amigables
  getFriendlyErrorMessage(error, response = null) {
    const errorMsg = error.message || ''
    
    // Detectar errores de base de datos específicamente
    if (errorMsg.includes('base de datos') || 
        errorMsg.includes('database') ||
        errorMsg.includes('No se pudo conectar')) {
      return FRIENDLY_ERROR_MESSAGES.SERVER
    }
    
    // Error de red (servidor no disponible, sin internet, etc.)
    if (errorMsg.includes('fetch') || errorMsg.includes('Network')) {
      return FRIENDLY_ERROR_MESSAGES.NETWORK
    }

    // Errores HTTP específicos
    if (response) {
      switch (response.status) {
        case 404:
          return FRIENDLY_ERROR_MESSAGES.NOT_FOUND
        case 401:
        case 403:
          return FRIENDLY_ERROR_MESSAGES.UNAUTHORIZED
        case 422:
        case 400:
          return FRIENDLY_ERROR_MESSAGES.VALIDATION
        case 500:
        case 502:
        case 503:
        case 504:
          return FRIENDLY_ERROR_MESSAGES.SERVER
        default:
          return FRIENDLY_ERROR_MESSAGES.DEFAULT
      }
    }

    return FRIENDLY_ERROR_MESSAGES.DEFAULT
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    
    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    }

    try {
      const response = await fetch(url, config)
      
      // Manejar respuestas 204 (No Content)
      if (response.status === 204) {
        return null
      }
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({
          detail: `HTTP Error: ${response.status}`
        }))
        
        // Lanzar error amigable
        const friendlyMessage = this.getFriendlyErrorMessage(new Error(error.detail), response)
        const errorObj = new Error(friendlyMessage)
        errorObj.originalError = error.detail
        errorObj.status = response.status
        throw errorObj
      }

      return await response.json()
    } catch (error) {
      // Si ya es un error procesado, lo lanzamos tal cual
      if (error.originalError) {
        console.error('API Error (original):', error.originalError)
        throw error
      }
      
      // Error de red o fetch
      console.error('Network/Fetch Error:', error)
      const friendlyMessage = this.getFriendlyErrorMessage(error)
      const errorObj = new Error(friendlyMessage)
      errorObj.originalError = error.message
      throw errorObj
    }
  }

  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' })
  }

  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  }

  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' })
  }
}

// Export singleton instance
export const apiClient = new ApiClient(API_BASE_URL)
