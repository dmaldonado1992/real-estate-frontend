// useImageOptimizer.js
// Composable para optimizar URLs de imágenes (Single Responsibility Principle)
export function useImageOptimizer() {
  /**
   * Optimiza URL de imagen de Unsplash con parámetros de tamaño
   * @param {string} url - URL original de la imagen
   * @param {number} width - Ancho deseado
   * @param {number} height - Alto deseado
   * @param {string} fit - Modo de ajuste (crop, max, etc)
   * @returns {string} URL optimizada
   */
  const optimizeUnsplashUrl = (url, width = 400, height = 300, fit = 'crop') => {
    if (!url) return ''
    
    // Si es una imagen de Unsplash, agregar parámetros de optimización
    if (url.includes('unsplash.com')) {
      const separator = url.includes('?') ? '&' : '?'
      return `${url}${separator}w=${width}&h=${height}&fit=${fit}&q=80&fm=webp`
    }
    
    return url
  }

  /**
   * Genera URL de placeholder mientras carga la imagen real
   * @param {string} url - URL original
   * @returns {string} URL de thumbnail
   */
  const getThumbnailUrl = (url) => {
    return optimizeUnsplashUrl(url, 50, 50, 'crop')
  }

  /**
   * Genera srcset para imágenes responsive
   * @param {string} url - URL original
   * @returns {string} srcset HTML
   */
  const generateSrcSet = (url) => {
    if (!url || !url.includes('unsplash.com')) return ''
    
    const sizes = [
      { width: 400, descriptor: '400w' },
      { width: 800, descriptor: '800w' },
      { width: 1200, descriptor: '1200w' }
    ]
    
    return sizes
      .map(size => `${optimizeUnsplashUrl(url, size.width, null, 'max')} ${size.descriptor}`)
      .join(', ')
  }

  return {
    optimizeUnsplashUrl,
    getThumbnailUrl,
    generateSrcSet
  }
}
