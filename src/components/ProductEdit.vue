<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="bg-white shadow-sm border border-gray-100 p-8">
      <div class="mb-8">
        <h2 class="text-xl font-bold tracking-tight text-gray-900 uppercase">Editar Propiedad</h2>
      </div>
      <form @submit.prevent="updateProduct" v-if="product">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="md:col-span-2">
            <label class="block text-gray-700 text-sm font-semibold mb-2 uppercase tracking-wide" for="titulo">
              Título
            </label>
            <input 
              v-model="product.titulo"
              class="w-full py-3 px-4 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              id="titulo"
              type="text"
              required
            >
          </div>
          <div class="md:col-span-2">
            <label class="block text-gray-700 text-sm font-semibold mb-2 uppercase tracking-wide" for="descripcion">
              Descripción
            </label>
            <textarea 
              v-model="product.descripcion"
              class="w-full py-3 px-4 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              id="descripcion"
              rows="4"
              required
            ></textarea>
          </div>
          <div>
            <label class="block text-gray-700 text-sm font-semibold mb-2 uppercase tracking-wide" for="tipo">
              Tipo de Propiedad
            </label>
            <select 
              v-model="product.tipo"
              class="w-full py-3 px-4 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              id="tipo"
              required
            >
              <option value="casa">Casa</option>
              <option value="departamento">Departamento</option>
              <option value="terreno">Terreno</option>
            </select>
          </div>
          <div>
            <label class="block text-gray-700 text-sm font-semibold mb-2 uppercase tracking-wide" for="precio">
              Precio
            </label>
            <input 
              v-model="product.precio"
              class="w-full py-3 px-4 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              id="precio"
              type="number"
              step="0.01"
              required
            >
          </div>
          <div>
            <label class="block text-gray-700 text-sm font-semibold mb-2 uppercase tracking-wide" for="habitaciones">
              Habitaciones
            </label>
            <input 
              v-model="product.habitaciones"
              class="w-full py-3 px-4 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              id="habitaciones"
              type="number"
              min="0"
              step="1"
              required
            >
          </div>
          <div>
            <label class="block text-gray-700 text-sm font-semibold mb-2 uppercase tracking-wide" for="banos">
              Baños
            </label>
            <input 
              v-model="product.banos"
              class="w-full py-3 px-4 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              id="banos"
              type="number"
              min="0"
              step="0.5"
              required
            >
          </div>
          <div>
            <label class="block text-gray-700 text-sm font-semibold mb-2 uppercase tracking-wide" for="area_m2">
              Área (m²)
            </label>
            <input 
              v-model="product.area_m2"
              class="w-full py-3 px-4 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              id="area_m2"
              type="number"
              min="0"
              step="0.01"
              required
            >
          </div>
          <div>
            <label class="block text-gray-700 text-sm font-semibold mb-2 uppercase tracking-wide" for="ubicacion">
              Ubicación
            </label>
            <input 
              v-model="product.ubicacion"
              class="w-full py-3 px-4 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              id="ubicacion"
              type="text"
              required
            >
          </div>
          <div class="md:col-span-2">
            <label class="block text-gray-700 text-sm font-semibold mb-2 uppercase tracking-wide" for="imagen_url">
              URL de la Imagen
            </label>
            <input 
              v-model="product.imagen_url"
              class="w-full py-3 px-4 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              id="imagen_url"
              type="url"
              required
            >
          </div>
          <div v-if="product.imagen_url" class="md:col-span-2">
            <label class="block text-gray-700 text-sm font-semibold mb-2 uppercase tracking-wide">
              Vista Previa
            </label>
            <img 
              :src="product.imagen_url"
              :alt="product.titulo"
              class="w-full h-64 object-cover"
            >
          </div>
        </div>
        <div v-if="error" class="mt-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm">
          {{ error }}
        </div>
        <div class="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
          <router-link 
            to="/products"
            class="text-gray-600 hover:text-gray-900 font-semibold text-sm uppercase tracking-wider transition-colors"
          >
            Cancelar
          </router-link>
          <button 
            type="submit"
            class="bg-gray-900 hover:bg-gray-800 text-white font-semibold py-2.5 px-8 transition-colors uppercase tracking-wider text-sm"
          >
            Actualizar Propiedad
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const product = ref(null)
const error = ref('')

import { API_ENDPOINTS } from '../config/api'

const fetchProduct = async () => {
  try {
    const response = await fetch(API_ENDPOINTS.PRODUCTS.GET(route.params.id))
    
    if (!response.ok) {
      console.error('Error fetching product:', response.status)
      alert('No se pudo cargar la propiedad. Por favor, intenta de nuevo.')
      router.push('/products')
      return
    }
    
    const data = await response.json()
    // Convertir campos numéricos
    product.value = {
      ...data,
      precio: Number(data.precio),
      habitaciones: Number(data.habitaciones),
      banos: Number(data.banos),
      area_m2: Number(data.area_m2)
    }
  } catch (err) {
    console.error('Error fetching product:', err)
    alert('No se pudo conectar con el servidor. Por favor, verifica tu conexión.')
    router.push('/products')
  }
}

const updateProduct = async () => {
  try {
    error.value = ''
    
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
      // Disparar eventos globales para recargar la lista y mostrar 'Ver todas'
      try {
        window.dispatchEvent(new CustomEvent('products-updated'))
        window.dispatchEvent(new CustomEvent('products-select-all'))
      } catch(e) {}
      router.push('/products')
    } else {
      // Mostrar error amigable
      if (response.status === 422 || response.status === 400) {
        error.value = 'Por favor, verifica que todos los campos estén completos y tengan el formato correcto.'
      } else if (response.status >= 500) {
        error.value = 'El servicio no está disponible en este momento. Por favor, intenta de nuevo más tarde.'
      } else {
        error.value = 'No se pudo actualizar la propiedad. Por favor, intenta de nuevo.'
      }
      console.error('Server error:', response.status)
    }
  } catch (err) {
    console.error('Error updating product:', err)
    error.value = 'No se pudo conectar con el servidor. Por favor, verifica tu conexión e intenta de nuevo.'
  }
}

onMounted(() => {
  fetchProduct()
})
</script>