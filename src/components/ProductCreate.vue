<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="bg-white shadow-sm border border-gray-100 p-8">
      <div class="mb-8">
        <h2 class="text-xl font-bold tracking-tight text-gray-900 uppercase">Crear Nueva Propiedad</h2>
      </div>
      <form @submit.prevent="createProduct">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="md:col-span-2">
            <label class="block text-gray-700 text-sm font-semibold mb-2 uppercase tracking-wide" for="titulo">
              Título
            </label>
            <input 
              v-model="formData.titulo"
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
              v-model="formData.descripcion"
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
              v-model="formData.tipo"
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
              v-model="formData.precio"
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
              v-model="formData.habitaciones"
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
              v-model="formData.banos"
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
              v-model="formData.area_m2"
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
              v-model="formData.ubicacion"
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
              v-model="formData.imagen_url"
              class="w-full py-3 px-4 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              id="imagen_url"
              type="url"
              required
            >
          </div>
          <div v-if="formData.imagen_url" class="md:col-span-2">
            <label class="block text-gray-700 text-sm font-semibold mb-2 uppercase tracking-wide">
              Vista Previa
            </label>
            <img 
              :src="formData.imagen_url"
              :alt="formData.titulo"
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
            Crear Propiedad
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const formData = ref({
  titulo: '',
  descripcion: '',
  tipo: 'casa',
  precio: '',
  habitaciones: 0,
  banos: 0,
  area_m2: 0,
  ubicacion: '',
  imagen_url: '',
  fecha_publicacion: new Date().toISOString().split('T')[0]  // Formato YYYY-MM-DD
})

import { API_ENDPOINTS } from '../config/api'

const error = ref('');

const validateForm = () => {
  if (!formData.value.titulo || !formData.value.descripcion || !formData.value.precio ||
      !formData.value.ubicacion || !formData.value.imagen_url) {
    error.value = 'Todos los campos son requeridos';
    return false;
  }

  if (isNaN(parseFloat(formData.value.precio)) || parseFloat(formData.value.precio) <= 0) {
    error.value = 'El precio debe ser un número válido mayor que 0';
    return false;
  }

  if (!Number.isInteger(Number(formData.value.habitaciones)) || Number(formData.value.habitaciones) < 0) {
    error.value = 'El número de habitaciones debe ser un número entero no negativo';
    return false;
  }

  if (isNaN(parseFloat(formData.value.banos)) || parseFloat(formData.value.banos) < 0) {
    error.value = 'El número de baños debe ser un número válido no negativo';
    return false;
  }

  if (isNaN(parseFloat(formData.value.area_m2)) || parseFloat(formData.value.area_m2) <= 0) {
    error.value = 'El área debe ser un número válido mayor que 0';
    return false;
  }

  error.value = '';
  return true;
};

const createProduct = async () => {
  try {
    if (!validateForm()) {
      return;
    }

    // Convertir campos numéricos con los tipos correctos
    const productData = {
      ...formData.value,
      precio: parseFloat(formData.value.precio),
      habitaciones: parseInt(formData.value.habitaciones),
      banos: parseFloat(formData.value.banos),
      area_m2: parseFloat(formData.value.area_m2),
      fecha_publicacion: formData.value.fecha_publicacion // Ya está en formato YYYY-MM-DD
    };

    const response = await fetch(API_ENDPOINTS.PRODUCTS.CREATE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(productData)
    });
    
    if (response.ok) {
      router.push('/products');
    } else {
      // Mostrar error amigable sin detalles técnicos
      if (response.status === 422 || response.status === 400) {
        error.value = 'Por favor, verifica que todos los campos estén completos y tengan el formato correcto.';
      } else if (response.status >= 500) {
        error.value = 'El servicio no está disponible en este momento. Por favor, intenta de nuevo más tarde.';
      } else {
        error.value = 'No se pudo crear la propiedad. Por favor, intenta de nuevo.';
      }
      console.error('Server error:', response.status);
    }
  } catch (err) {
    console.error('Error creating product:', err);
    error.value = 'No se pudo conectar con el servidor. Por favor, verifica tu conexión e intenta de nuevo.';
  }
}
</script>