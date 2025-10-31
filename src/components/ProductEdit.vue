<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-md mx-auto bg-white rounded-lg overflow-hidden shadow-md">
      <div class="px-6 py-4">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Editar Producto</h2>
        <form @submit.prevent="updateProduct" v-if="product">
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="titulo">
              Título
            </label>
            <input 
              v-model="product.titulo"
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="titulo"
              type="text"
              required
            >
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="descripcion">
              Descripción
            </label>
            <textarea 
              v-model="product.descripcion"
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="descripcion"
              rows="3"
              required
            ></textarea>
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="tipo">
              Tipo de Propiedad
            </label>
            <select 
              v-model="product.tipo"
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="tipo"
              required
            >
              <option value="casa">Casa</option>
              <option value="departamento">Departamento</option>
              <option value="terreno">Terreno</option>
            </select>
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="precio">
              Precio
            </label>
            <input 
              v-model="product.precio"
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="precio"
              type="number"
              step="0.01"
              required
            >
          </div>
          <div class="grid grid-cols-3 gap-4">
            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2" for="habitaciones">
                Habitaciones
              </label>
              <input 
                v-model="product.habitaciones"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="habitaciones"
                type="number"
                min="0"
                step="1"
                required
              >
            </div>
            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2" for="banos">
                Baños
              </label>
              <input 
                v-model="product.banos"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="banos"
                type="number"
                min="0"
                step="0.5"
                required
              >
            </div>
            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2" for="area_m2">
                Área (m²)
              </label>
              <input 
                v-model="product.area_m2"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="area_m2"
                type="number"
                min="0"
                step="0.01"
                required
              >
            </div>
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="ubicacion">
              Ubicación
            </label>
            <input 
              v-model="product.ubicacion"
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="ubicacion"
              type="text"
              required
            >
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="imagen_url">
              URL de la Imagen
            </label>
            <input 
              v-model="product.imagen_url"
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="imagen_url"
              type="url"
              required
            >
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2">
              Vista Previa
            </label>
            <img 
              v-if="product.imagen_url"
              :src="product.imagen_url"
              :alt="product.titulo"
              class="w-full h-48 object-cover rounded"
            >
          </div>
          <div class="flex items-center justify-between">
            <button 
              type="submit"
              class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Actualizar Producto
            </button>
            <router-link 
              to="/products"
              class="text-blue-500 hover:text-blue-800"
            >
              Cancelar
            </router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const product = ref(null)

import { API_ENDPOINTS } from '../config/api'

const fetchProduct = async () => {
  try {
    const response = await fetch(API_ENDPOINTS.PRODUCTS.GET(route.params.id))
    const data = await response.json()
    // Convertir campos numéricos
    product.value = {
      ...data,
      precio: Number(data.precio),
      habitaciones: Number(data.habitaciones),
      banos: Number(data.banos),
      area_m2: Number(data.area_m2)
    }
  } catch (error) {
    console.error('Error fetching product:', error)
    router.push('/products')
  }
}

const updateProduct = async () => {
  try {
    const productData = {
      ...product.value,
      precio: Number(product.value.precio),
      habitaciones: Number(product.value.habitaciones),
      banos: Number(product.value.banos),
      area_m2: Number(product.value.area_m2)
    }

    const response = await fetch(API_ENDPOINTS.PRODUCTS.UPDATE(route.params.id), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(productData)
    })
    
    if (response.ok) {
      router.push('/products')
    } else {
      const errorData = await response.json()
      console.error('Server error:', errorData)
    }
  } catch (error) {
    console.error('Error updating product:', error)
  }
}

onMounted(() => {
  fetchProduct()
})
</script>