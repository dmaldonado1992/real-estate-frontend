<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="flex justify-between items-center mb-8">
      <h2 class="text-xl font-bold tracking-tight text-gray-900 uppercase">Propiedades en Venta</h2>
      <router-link 
        to="/products/create" 
        class="bg-gray-900 hover:bg-gray-800 text-white font-semibold py-2.5 px-6 transition-colors uppercase tracking-wider text-sm"
      >
        Agregar Propiedad
      </router-link>
    </div>

    <!-- Banner de resultados del ChatBox -->
    <div v-if="showingChatResults" class="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clip-rule="evenodd" />
        </svg>
        <div>
          <p class="font-semibold text-blue-900">Mostrando resultados de búsqueda del ChatBox</p>
          <p class="text-sm text-blue-700">{{ products.total }} propiedades encontradas</p>
        </div>
      </div>
      <button 
        @click="handleResetToAll"
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-semibold text-sm uppercase tracking-wider transition-colors"
      >
        Ver todas
      </button>
    </div>

    <!-- Buscador -->
    <div class="mb-8">
      <div class="flex gap-4">
        <input
          v-model="searchTerm"
          @input="handleSearch"
          type="text"
          placeholder="Buscar propiedades..."
          class="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
        />
      </div>
    </div>

    <!-- Grid de Propiedades -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <template v-if="products.items && products.items.length > 0">
        <div 
          v-for="product in products.items" 
          :key="product.id" 
          class="bg-white shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100"
        >
          <div class="relative h-48">
            <!-- Componente optimizado de imagen lazy -->
            <LazyImage 
              :src="product.imagen_url" 
              :alt="product.titulo"
            />
            <div class="absolute top-0 right-0 bg-gray-900 text-white px-4 py-2 m-3 shadow-lg font-semibold">
              {{ formatPrice(product.precio) }}
            </div>
          </div>
          <div class="p-6">
            <h3 class="text-lg font-bold tracking-tight text-gray-900 mb-2">{{ product.titulo }}</h3>
            <p class="text-sm text-gray-500 mb-4">{{ product.ubicacion }}</p>
            <p class="text-sm mb-6 text-gray-700">
              {{ product.habitaciones }} hab · {{ product.banos }} baños · {{ product.area_m2 }}m² · {{ product.tipo }}
            </p>
            <div class="flex justify-between items-center gap-3">
              <router-link 
                :to="'/products/' + product.id" 
                class="flex-1 text-center bg-gray-900 hover:bg-gray-800 text-white px-4 py-2.5 transition-colors font-semibold text-sm uppercase tracking-wider"
              >
                Editar
              </router-link>
              <button 
                @click="handleDelete(product.id)" 
                class="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 transition-colors font-semibold text-sm uppercase tracking-wider"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="col-span-3 text-center py-16">
          <p class="text-gray-500 text-xl">No se encontraron propiedades</p>
        </div>
      </template>
    </div>

    <!-- Paginación -->
    <div v-if="products.totalPages > 1" class="mt-12">
      <nav class="flex justify-center space-x-2" aria-label="Pagination">
        <button
          @click="changePage(currentPage - 1)"
          :disabled="currentPage === 1"
          class="px-6 py-2.5 font-semibold text-sm uppercase tracking-wider"
          :class="currentPage === 1 ? 'text-gray-400 bg-gray-100' : 'text-gray-900 bg-white border border-gray-900 hover:bg-gray-900 hover:text-white transition-colors'"
        >
          Anterior
        </button>
        
        <button
          v-for="pageNum in products.totalPages"
          :key="pageNum"
          @click="changePage(pageNum)"
          class="px-6 py-2.5 font-semibold text-sm uppercase tracking-wider transition-colors"
          :class="pageNum === currentPage
            ? 'bg-gray-900 text-white'
            : 'text-gray-900 bg-white border border-gray-900 hover:bg-gray-900 hover:text-white'"
        >
          {{ pageNum }}
        </button>

        <button
          @click="changePage(currentPage + 1)"
          :disabled="currentPage === products.totalPages"
          class="px-6 py-2.5 font-semibold text-sm uppercase tracking-wider"
          :class="currentPage === products.totalPages ? 'text-gray-400 bg-gray-100' : 'text-gray-900 bg-white border border-gray-900 hover:bg-gray-900 hover:text-white transition-colors'"
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
import { useSharedProperties } from '../composables/useSharedProperties'
import { useFormatter } from '../composables/useFormatter'
import LazyImage from './LazyImage.vue'

// Composables (Dependency Injection pattern en Vue 3)
const { properties, loadProperties, deleteProperty, resetToAllProperties, isLoading, error } = usePropertyService()
const { shouldUpdateFromChat, chatUpdateCounter } = useSharedProperties()
const { formatPrice } = useFormatter()

// Estado local del componente
const itemsPerPage = 15
const searchTerm = ref('')
const currentPage = ref(1)
let searchTimeout = null

// Computed para saber si estamos mostrando resultados del chat
const showingChatResults = computed(() => shouldUpdateFromChat.value)

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

const handleResetToAll = async () => {
  searchTerm.value = ''
  currentPage.value = 1
  await resetToAllProperties()
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

// Watch para recargar cuando cambien los resultados del chat
// Usamos chatUpdateCounter que se incrementa cada vez que llegan nuevos resultados
watch(chatUpdateCounter, async (newVal) => {
  if (newVal > 0) {
    console.log(`🔄 ProductList detectó actualización del ChatBox (#${newVal})`)
    // Recargar propiedades para obtener los resultados del chat
    await loadProperties()
    currentPage.value = 1
  }
})

// Lifecycle
onMounted(() => {
  loadProperties()
})
</script>