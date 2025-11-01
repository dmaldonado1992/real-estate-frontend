<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-gray-800">Propiedades en Venta</h2>
      <router-link 
        to="/products/create" 
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Agregar Propiedad
      </router-link>
    </div>

    <!-- Buscador -->
    <div class="mb-6">
      <div class="flex gap-4">
        <input
          v-model="searchTerm"
          @input="handleSearch"
          type="text"
          placeholder="Buscar propiedades..."
          class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>

    <!-- Grid de Propiedades -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <template v-if="products.items && products.items.length > 0">
        <div 
          v-for="product in products.items" 
          :key="product.id" 
          class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
        >
          <div class="relative h-48">
            <!-- Componente optimizado de imagen lazy -->
            <LazyImage 
              :src="product.imagen_url" 
              :alt="product.titulo"
            />
            <div class="absolute top-0 right-0 bg-blue-600 text-white px-3 py-1 m-2 rounded shadow-lg">
              {{ formatPrice(product.precio) }}
            </div>
          </div>
          <div class="p-4">
            <h3 class="text-lg font-semibold text-gray-800 mb-2">{{ product.titulo }}</h3>
            <p class="text-sm text-gray-500 mb-3">{{ product.ubicacion }}</p>
            <p class="text-sm mb-4 text-gray-600">
              {{ product.habitaciones }} hab · {{ product.banos }} baños · {{ product.area_m2 }}m² · {{ product.tipo }}
            </p>
            <div class="flex justify-between items-center">
              <router-link 
                :to="'/products/' + product.id" 
                class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors duration-200"
              >
                Editar
              </router-link>
              <button 
                @click="handleDelete(product.id)" 
                class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors duration-200"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="col-span-3 text-center py-10">
          <p class="text-gray-500 text-xl">No se encontraron propiedades</p>
        </div>
      </template>
    </div>

    <!-- Paginación -->
    <div v-if="products.totalPages > 1" class="mt-8">
      <nav class="flex justify-center space-x-2" aria-label="Pagination">
        <button
          @click="changePage(currentPage - 1)"
          :disabled="currentPage === 1"
          class="px-4 py-2 rounded-lg border"
          :class="currentPage === 1 ? 'text-gray-400 border-gray-200' : 'text-blue-600 border-blue-600 hover:bg-blue-50'"
        >
          Anterior
        </button>
        
        <button
          v-for="pageNum in products.totalPages"
          :key="pageNum"
          @click="changePage(pageNum)"
          class="px-4 py-2 rounded-lg"
          :class="pageNum === currentPage
            ? 'bg-blue-600 text-white'
            : 'text-blue-600 border border-blue-600 hover:bg-blue-50'"
        >
          {{ pageNum }}
        </button>

        <button
          @click="changePage(currentPage + 1)"
          :disabled="currentPage === products.totalPages"
          class="px-4 py-2 rounded-lg border"
          :class="currentPage === products.totalPages ? 'text-gray-400 border-gray-200' : 'text-blue-600 border-blue-600 hover:bg-blue-50'"
        >
          Siguiente
        </button>
      </nav>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { usePropertyService } from '../composables/usePropertyService'
import { useFormatter } from '../composables/useFormatter'
import LazyImage from './LazyImage.vue'

// Composables (Dependency Injection pattern en Vue 3)
const { properties, loadProperties, deleteProperty, isLoading, error } = usePropertyService()
const { formatPrice } = useFormatter()

// Estado local del componente
const itemsPerPage = 15
const searchTerm = ref('')
const currentPage = ref(1)
let searchTimeout = null

// Computed properties para filtrado y paginación
const filteredProperties = computed(() => {
  const searchLower = searchTerm.value.toLowerCase()
  return properties.value.filter(product => 
    product.titulo.toLowerCase().includes(searchLower) ||
    product.descripcion.toLowerCase().includes(searchLower) ||
    product.ubicacion.toLowerCase().includes(searchLower) ||
    product.tipo.toLowerCase().includes(searchLower)
  )
})

const products = computed(() => {
  const filtered = filteredProperties.value
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  
  return {
    items: filtered.slice(start, end),
    total: filtered.length,
    page: currentPage.value,
    totalPages: Math.ceil(filtered.length / itemsPerPage)
  }
})

// Métodos
const handleSearch = () => {
  currentPage.value = 1
}

const changePage = (page) => {
  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const handleDelete = async (id) => {
  if (!confirm('¿Estás seguro de que quieres eliminar esta propiedad?')) return

  try {
    await deleteProperty(id)
  } catch (err) {
    alert('Error al eliminar la propiedad')
  }
}

// Watchers
watch(searchTerm, () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
  searchTimeout = setTimeout(() => {
    handleSearch()
  }, 300)
})

// Lifecycle
onMounted(() => {
  loadProperties()
})
</script>