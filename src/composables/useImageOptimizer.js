// useImageOptimizer.js
// Composable para optimizar URLs de imágenes con fallbacks múltiples
export function useImageOptimizer() {
  // Token de Unsplash desde variables de entorno
  const unsplashToken = import.meta.env.VITE_UNSPLASH_ACCESS_KEY
  
  /**
   * Optimiza URL de imagen de Unsplash con parámetros de tamaño
   * @param {string} url - URL original de la imagen
   * @param {number} width - Ancho deseado
   * @param {number} height - Alto deseado
   * @param {string} fit - Modo de ajuste (crop, max, etc)
   * @returns {string} URL optimizada
   */
  const optimizeUnsplashUrl = (url, width = 400, height = 300, fit = 'crop') => {
    if (!url) {
      // Si no hay URL, usar placeholder
      return getPlaceholderUrl(width, height, 'Propiedad')
    }
    
    // Si es una imagen de Unsplash, agregar parámetros de optimización
    if (url.includes('unsplash.com')) {
      // Limpiar URL existente de parámetros
      const baseUrl = url.split('?')[0]
      
      // Construir URL con parámetros optimizados
      let optimizedUrl = `${baseUrl}?w=${width}&h=${height}&fit=${fit}&q=85&auto=format&fm=webp`
      
      // Si hay token de Unsplash, agregarlo
      if (unsplashToken && unsplashToken !== 'YOUR_UNSPLASH_ACCESS_KEY') {
        optimizedUrl += `&client_id=${unsplashToken}`
      }
      
      return optimizedUrl
    }
    
    // Si es otra URL, retornarla tal cual
    return url
  }

  /**
   * Genera URL de placeholder personalizable
   * @param {number} width - Ancho
   * @param {number} height - Alto  
   * @param {string} text - Texto del placeholder
   * @param {string} bgColor - Color de fondo (hex sin #)
   * @param {string} textColor - Color del texto (hex sin #)
   * @returns {string} URL del placeholder
   */
  const getPlaceholderUrl = (width = 400, height = 300, text = 'Imagen', bgColor = 'e5e7eb', textColor = '9ca3af') => {
    return `https://placehold.co/${width}x${height}/${bgColor}/${textColor}?text=${encodeURIComponent(text)}`
  }

  /**
   * Array de URLs de fallback para propiedades inmobiliarias
   * @param {number} width - Ancho deseado
   * @param {number} height - Alto deseado
   * @returns {Array<string>} Array de URLs de fallback
   */
  const getFallbackUrls = (width = 400, height = 300) => {
    return [
      // Placeholders específicos para bienes raíces
      getPlaceholderUrl(width, height, 'Casa', 'f3f4f6', '6b7280'),
      getPlaceholderUrl(width, height, 'Propiedad', 'e5e7eb', '9ca3af'),
      getPlaceholderUrl(width, height, 'Inmueble', 'f9fafb', '374151'),
      // Último recurso
      `data:image/svg+xml;base64,${btoa(`
        <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
          <rect width="100%" height="100%" fill="#f3f4f6"/>
          <text x="50%" y="50%" font-family="Arial" font-size="16" fill="#9ca3af" text-anchor="middle" dy=".3em">
            Sin imagen
          </text>
        </svg>
      `)}`
    ]
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
    generateSrcSet,
    getPlaceholderUrl,
    getFallbackUrls
  }
}
