// apiClient.js
// Cliente HTTP genérico (Open/Closed Principle)
// Abierto para extensión, cerrado para modificación

const API_BASE_URL = 'http://localhost:8000/api'

class ApiClient {
  constructor(baseURL) {
    this.baseURL = baseURL
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
        throw new Error(error.detail || `Error: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('API Error:', error)
      throw error
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
