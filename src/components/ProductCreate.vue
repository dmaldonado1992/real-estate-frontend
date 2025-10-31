<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-md mx-auto bg-white rounded-lg overflow-hidden shadow-md">
      <div class="px-6 py-4">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Crear Nueva Propiedad</h2>
        <form @submit.prevent="createProduct">
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="titulo">
              Título
            </label>
            <input 
              v-model="formData.titulo"
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
              v-model="formData.descripcion"
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
              v-model="formData.tipo"
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
              v-model="formData.precio"
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
                v-model="formData.habitaciones"
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
                v-model="formData.banos"
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
                v-model="formData.area_m2"
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
              v-model="formData.ubicacion"
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
              v-model="formData.imagen_url"
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
              v-if="formData.imagen_url"
              :src="formData.imagen_url"
              :alt="formData.titulo"
              class="w-full h-48 object-cover rounded"
            >
          </div>
          <div v-if="error" class="mb-4 text-red-500 text-sm font-bold">
            {{ error }}
          </div>
          <div class="flex items-center justify-between">
            <button 
              type="submit"
              class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Crear Producto
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
      const errorData = await response.json();
      if (response.status === 422) {
        error.value = 'Error de validación: Verifica que todos los campos tengan el formato correcto';
      } else {
        error.value = errorData.detail || 'Error al crear el producto';
      }
      console.error('Server error:', errorData);
    }
  } catch (error) {
    console.error('Error creating product:', error);
    error.value = 'Error al conectar con el servidor';
  }
}
</script>