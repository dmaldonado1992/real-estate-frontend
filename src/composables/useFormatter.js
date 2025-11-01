// useFormatter.js
// Composable para formateo de datos (Single Responsibility Principle)
export function useFormatter() {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0
    }).format(price)
  }

  const formatNumber = (number) => {
    return new Intl.NumberFormat('es-MX').format(number)
  }

  const formatDate = (date) => {
    if (!date) return ''
    return new Intl.DateFormat('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(date))
  }

  return {
    formatPrice,
    formatNumber,
    formatDate
  }
}
