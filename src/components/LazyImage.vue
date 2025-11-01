<template>
  <div class="relative w-full h-full overflow-hidden bg-gray-200">
    <!-- Thumbnail borroso de carga rápida -->
    <img
      v-if="!isLoaded && !hasError && thumbnailSrc"
      :src="thumbnailSrc"
      :alt="alt"
      class="absolute inset-0 w-full h-full object-cover blur-sm scale-110"
    />

    <!-- Placeholder mientras carga -->
    <div 
      v-if="!isLoaded && !hasError"
      class="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300"
      :class="{ 'animate-pulse': !thumbnailSrc }"
    >
      <svg v-if="!thumbnailSrc" class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    </div>

    <!-- Imagen real optimizada -->
    <img
      v-show="isLoaded"
      ref="imageRef"
      :data-src="optimizedSrc"
      :alt="alt"
      :class="imageClass"
      class="w-full h-full object-cover transition-opacity duration-700"
      :style="{ opacity: isLoaded ? 1 : 0 }"
      @load="handleLoad"
      @error="handleError"
    />

    <!-- Error state -->
    <div 
      v-if="hasError"
      class="absolute inset-0 flex flex-col items-center justify-center bg-gray-100"
    >
      <svg class="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span class="text-sm text-gray-500">Error al cargar imagen</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
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

const { optimizeUnsplashUrl, getThumbnailUrl } = useImageOptimizer()

const imageRef = ref(null)
const isLoaded = ref(false)
const hasError = ref(false)
let observer = null

// URLs optimizadas
const optimizedSrc = computed(() => 
  optimizeUnsplashUrl(props.src, props.width, props.height)
)

const thumbnailSrc = computed(() => 
  getThumbnailUrl(props.src)
)

const handleLoad = () => {
  isLoaded.value = true
  hasError.value = false
}

const handleError = () => {
  hasError.value = true
  isLoaded.value = false
}

const loadImage = () => {
  if (imageRef.value && imageRef.value.dataset.src) {
    imageRef.value.src = imageRef.value.dataset.src
  }
}

onMounted(() => {
  // Usar IntersectionObserver para lazy loading
  if ('IntersectionObserver' in window) {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            loadImage()
            if (observer && imageRef.value) {
              observer.unobserve(imageRef.value)
            }
          }
        })
      },
      {
        rootMargin: '150px', // Cargar 150px antes de que sea visible
        threshold: 0.01
      }
    )

    if (imageRef.value) {
      observer.observe(imageRef.value)
    }
  } else {
    // Fallback para navegadores sin IntersectionObserver
    loadImage()
  }
})

onUnmounted(() => {
  if (observer && imageRef.value) {
    observer.unobserve(imageRef.value)
  }
})
</script>
