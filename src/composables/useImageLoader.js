// useImageLoader.js
// Composable para manejo optimizado de carga de imágenes (Single Responsibility Principle)
// Implementa lazy loading con IntersectionObserver para mejor performance
import { ref, onMounted, onUnmounted } from 'vue'

export function useImageLoader() {
  const loadedImages = ref(new Set())
  const failedImages = ref(new Set())
  const observer = ref(null)

  const isImageLoaded = (imageId) => {
    return loadedImages.value.has(imageId)
  }

  const isImageFailed = (imageId) => {
    return failedImages.value.has(imageId)
  }

  const markImageAsLoaded = (imageId) => {
    loadedImages.value.add(imageId)
    failedImages.value.delete(imageId)
  }

  const markImageAsFailed = (imageId) => {
    failedImages.value.add(imageId)
    loadedImages.value.delete(imageId)
  }

  const resetLoadedImages = () => {
    loadedImages.value.clear()
    failedImages.value.clear()
  }

  // Crear IntersectionObserver para lazy loading
  const createObserver = (callback) => {
    if ('IntersectionObserver' in window) {
      observer.value = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && callback) {
              callback(entry.target)
              observer.value.unobserve(entry.target)
            }
          })
        },
        {
          rootMargin: '50px', // Cargar imagen 50px antes de que sea visible
          threshold: 0.01
        }
      )
    }
  }

  const observeImage = (element) => {
    if (observer.value && element) {
      observer.value.observe(element)
    }
  }

  const disconnectObserver = () => {
    if (observer.value) {
      observer.value.disconnect()
    }
  }

  onUnmounted(() => {
    disconnectObserver()
  })

  return {
    isImageLoaded,
    isImageFailed,
    markImageAsLoaded,
    markImageAsFailed,
    resetLoadedImages,
    createObserver,
    observeImage,
    disconnectObserver
  }
}
