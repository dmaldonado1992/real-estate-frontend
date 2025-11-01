// propertyApiService.js
// Servicio API para propiedades (Single Responsibility Principle)
// Responsable únicamente de la comunicación HTTP con el backend

import { apiClient } from './apiClient'

class PropertyApiService {
  constructor(client) {
    this.client = client
    this.basePath = '/products'
  }

  async getAll() {
    return await this.client.get(this.basePath)
  }

  async getById(id) {
    return await this.client.get(`${this.basePath}/${id}`)
  }

  async create(data) {
    return await this.client.post(this.basePath, data)
  }

  async update(id, data) {
    return await this.client.put(`${this.basePath}/${id}`, data)
  }

  async delete(id) {
    return await this.client.delete(`${this.basePath}/${id}`)
  }
}

// Export singleton instance
export const propertyApiService = new PropertyApiService(apiClient)
