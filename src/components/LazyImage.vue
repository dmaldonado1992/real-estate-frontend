<template>
  <div class="relative w-full h-full overflow-hidden bg-gray-200">
    <!-- Placeholder inicial mientras carga -->
    <div 
      v-if="!isImageVisible && !hasError"
      class="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300"
      :class="{ 'animate-pulse': isLoading }"
    >
      <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      <div v-if="isLoading" class="absolute bottom-2 left-2 right-2">
        <div class="w-full bg-gray-300 rounded-full h-1">
          <div class="bg-blue-500 h-1 rounded-full transition-all duration-300" :style="{ width: `${loadingProgress}%` }"></div>
        </div>
      </div>
    </div>

    <!-- Imagen principal -->
    <img
      v-show="isImageVisible && !hasError"
      :src="currentImageSrc"
      :alt="alt"
      :class="imageClass"
      class="w-full h-full object-cover transition-all duration-500 ease-in-out"
      :style="{ 
        opacity: isImageVisible ? 1 : 0,
        transform: isImageVisible ? 'scale(1)' : 'scale(1.05)'
      }"
      @load="handleImageLoad"
      @error="handleImageError"
      loading="lazy"
      decoding="async"
    />

    <!-- Fallback cuando falla la imagen principal -->
    <img
      v-if="showFallback && !hasError"
      :src="fallbackSrc"
      :alt="alt"
      :class="imageClass"
      class="w-full h-full object-cover transition-opacity duration-500"
      style="opacity: 0.8"
      @load="handleFallbackLoad"
      @error="handleFallbackError"
      loading="lazy"
    />

    <!-- Estado de error final -->
    <div 
      v-if="hasError"
      class="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200"
    >
      <svg class="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span class="text-sm text-gray-500">Sin imagen disponible</span>
      <button 
        @click="retryImageLoad"
        class="mt-2 px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        Reintentar
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useImageOptimizer } from '../composables/useImageOptimizer'

const props = defineProps({
  src: {
    type: String,
    required: true
  },
  alt: {
    type: String,
    default: ''
  },
  imageClass: {
    type: String,
    default: ''
  },
  width: {
    type: Number,
    default: 400
  },
  height: {
    type: Number,
    default: 300
  }
})

const { optimizeUnsplashUrl } = useImageOptimizer()

// Estados de carga
const isImageVisible = ref(false)
const hasError = ref(false)
const isLoading = ref(true)
const loadingProgress = ref(0)
const showFallback = ref(false)
const retryCount = ref(0)
const maxRetries = 3

// Simulador de progreso de carga
let progressInterval = null

// URLs de imagen
const primaryImageSrc = computed(() => {
  if (!props.src) return ''
  return optimizeUnsplashUrl(props.src, props.width, props.height)
})

const fallbackSrc = computed(() => {
  // Placeholder de backup
  return `https://placehold.co/${props.width}x${props.height}/e5e7eb/9ca3af?text=Propiedad`
})

const currentImageSrc = computed(() => {
  return showFallback.value ? fallbackSrc.value : primaryImageSrc.value
})

// Manejo de eventos de imagen principal
const handleImageLoad = () => {
  isImageVisible.value = true
  isLoading.value = false
  hasError.value = false
  showFallback.value = false
  stopProgressSimulation()
}

const handleImageError = (e) => {
  console.warn('⚠️ Error en imagen principal:', props.src, e)
  
  if (retryCount.value < maxRetries) {
    retryCount.value++
    setTimeout(() => {
      // Retry with cache busting
      const retryUrl = primaryImageSrc.value + (primaryImageSrc.value.includes('?') ? '&' : '?') + `retry=${retryCount.value}`
      currentImageSrc.value = retryUrl
    }, 1000 * retryCount.value)
  } else {
    showFallback.value = true
    isLoading.value = false
  }
}

// Manejo de eventos de imagen de fallback
const handleFallbackLoad = () => {
  isImageVisible.value = true
  isLoading.value = false
  hasError.value = false
  stopProgressSimulation()
}

const handleFallbackError = () => {
  console.error('❌ Error en imagen de fallback también')
  hasError.value = true
  isLoading.value = false
  showFallback.value = false
  isImageVisible.value = false
  stopProgressSimulation()
}

// Reintentar carga manual
const retryImageLoad = () => {
  hasError.value = false
  isLoading.value = true
  isImageVisible.value = false
  showFallback.value = false
  retryCount.value = 0
  startProgressSimulation()
  
  // Forzar recarga agregando timestamp
  const timestamp = Date.now()
  const retryUrl = primaryImageSrc.value + (primaryImageSrc.value.includes('?') ? '&' : '?') + `t=${timestamp}`
  
  // Crear nueva imagen para forzar recarga
  const testImg = new Image()
  testImg.onload = handleImageLoad
  testImg.onerror = handleImageError
  testImg.src = retryUrl
}

// Simulación de progreso de carga (UX)
const startProgressSimulation = () => {
  loadingProgress.value = 0
  progressInterval = setInterval(() => {
    if (loadingProgress.value < 90) {
      loadingProgress.value += Math.random() * 15
    }
  }, 300)
}

const stopProgressSimulation = () => {
  if (progressInterval) {
    clearInterval(progressInterval)
    progressInterval = null
  }
  loadingProgress.value = 100
  setTimeout(() => {
    loadingProgress.value = 0
  }, 500)
}

// Precargar imagen al montar componente
onMounted(() => {
  if (primaryImageSrc.value) {
    startProgressSimulation()
    
    // Precargar imagen usando Image API
    const preloadImg = new Image()
    preloadImg.onload = handleImageLoad
    preloadImg.onerror = handleImageError
    preloadImg.src = primaryImageSrc.value
  } else {
    // Si no hay src, mostrar error inmediatamente
    hasError.value = true
    isLoading.value = false
  }
})

onUnmounted(() => {
  stopProgressSimulation()
})
</script>
