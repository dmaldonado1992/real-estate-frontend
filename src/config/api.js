const API_URL = 'http://127.0.0.1:8000/api'

export const API_ENDPOINTS = {
  PRODUCTS: {
    LIST: `${API_URL}/products`,
    GET: (id) => `${API_URL}/products/${id}`,
    CREATE: `${API_URL}/products`,
    UPDATE: (id) => `${API_URL}/products/${id}`,
    DELETE: (id) => `${API_URL}/products/${id}`,
  }
}

export default API_ENDPOINTS