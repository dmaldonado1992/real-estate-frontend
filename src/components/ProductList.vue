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
          :class="{'opacity-0': isLoading}"
        >
          <div class="relative">
            <div class="w-full h-48 bg-gray-200 animate-pulse">
              <img 
                :src="product.imagen_url" 
                :alt="product.titulo" 
                class="w-full h-48 object-cover transition-opacity duration-300"
                :class="{'opacity-0': !imageLoaded[product.id]}"
                @load="handleImageLoad(product.id)"
                loading="lazy"
              >
            </div>
            <div class="absolute top-0 right-0 bg-blue-600 text-white px-3 py-1 m-2 rounded">
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
                @click="deleteProduct(product.id)" 
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
import { API_ENDPOINTS } from '../config/api'

const allProducts = ref([])
const itemsPerPage = 20
const searchTerm = ref('')
const currentPage = ref(1)
const isLoading = ref(false)
const imageLoaded = ref({})
let searchTimeout = null

const filteredProducts = computed(() => {
  const searchLower = searchTerm.value.toLowerCase()
  return allProducts.value.filter(product => 
    product.titulo.toLowerCase().includes(searchLower) ||
    product.descripcion.toLowerCase().includes(searchLower) ||
    product.ubicacion.toLowerCase().includes(searchLower) ||
    product.tipo.toLowerCase().includes(searchLower)
  )
})

const products = computed(() => {
  const filtered = filteredProducts.value
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  
  return {
    items: filtered.slice(start, end),
    total: filtered.length,
    page: currentPage.value,
    totalPages: Math.ceil(filtered.length / itemsPerPage)
  }
})

const handleImageLoad = (productId) => {
  imageLoaded.value[productId] = true
}

const fetchProducts = async () => {
  try {
    isLoading.value = true
    const response = await fetch(API_ENDPOINTS.PRODUCTS.LIST)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    allProducts.value = data
    
    // Reiniciar el estado de carga de imágenes
    imageLoaded.value = {}
    data.forEach(product => {
      imageLoaded.value[product.id] = false
    })
  } catch (error) {
    console.error('Error fetching products:', error)
  } finally {
    isLoading.value = false
  }
}

const handleSearch = () => {
  // Reset to first page when searching
  currentPage.value = 1
}

const changePage = (page) => {
  isLoading.value = true
  currentPage.value = page
  // Scroll to top of the page
  window.scrollTo({ top: 0, behavior: 'smooth' })
  // Dar tiempo para que el scroll termine antes de mostrar el contenido
  setTimeout(() => {
    isLoading.value = false
  }, 500)
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(price)
}

const deleteProduct = async (id) => {
  if (!confirm('¿Estás seguro de que quieres eliminar esta propiedad?')) return

  try {
    const response = await fetch(API_ENDPOINTS.PRODUCTS.DELETE(id), {
      method: 'DELETE'
    })
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    await fetchProducts() // Refetch all products
  } catch (error) {
    console.error('Error deleting product:', error)
  }
}

// Watch for changes in searchTerm with debouncing
watch(searchTerm, () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
  searchTimeout = setTimeout(() => {
    handleSearch()
  }, 300)
})

onMounted(() => {
  fetchProducts()
})
</script>