<template>
  <div class="chatbox-container">
    <!-- Botón flotante para abrir/cerrar el chat -->
    <button 
      v-if="!isOpen" 
      @click="toggleChat" 
      class="chat-button"
      aria-label="Abrir asistente inmobiliario"
    >
      <div class="chat-icon-container">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
        <div class="chat-pulse-ring"></div>
      </div>
      <span class="chat-badge" v-if="unreadCount > 0">{{ unreadCount }}</span>
    </button>

    <!-- Ventana del chat -->
    <div v-if="isOpen" class="chat-window" :class="{ 'chat-window-expanded': hasSearchResults }">
      <!-- Header -->
      <div class="chat-header">
        <div class="flex items-center gap-3">
          <div class="assistant-avatar">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div>
            <h3 class="text-white font-semibold">Consultor Inmobiliario</h3>
            <p class="text-xs text-gray-300">{{ isTyping ? 'Procesando consulta...' : 'Disponible' }}</p>
          </div>
        </div>
        <button @click.stop="toggleChat" class="close-button" aria-label="Cerrar chat">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Mensajes -->
      <div ref="messagesContainer" class="chat-messages">
        <div v-if="messages.length === 0" class="welcome-message">
          <div class="text-center p-4">
            <div class="welcome-icon-container">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-10 h-10 text-slate-600">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h4 class="text-base font-semibold text-gray-800 mb-2">Consultor Inmobiliario</h4>
            <p class="text-sm text-gray-600 mb-4">¿En qué puedo ayudarle hoy?</p>
            
            <!-- Preguntas de ejemplo -->
            <div class="example-questions">
              <button 
                @click="sendExampleQuery('Casa de 3 habitaciones')"
                class="example-btn"
              >
                Casa de 3 habitaciones
              </button>
              <button 
                @click="sendExampleQuery('Apartamento con 2 baños')"
                class="example-btn"
              >
                Apartamento con 2 baños
              </button>
              <button 
                @click="sendExampleQuery('Menos de 300 mil')"
                class="example-btn"
              >
                Menos de 300 mil
              </button>
              <button 
                @click="sendExampleQuery('En zona 10')"
                class="example-btn"
              >
                En zona 10
              </button>
              <button 
                @click="sendExampleQuery('Casa con jardín')"
                class="example-btn"
              >
                Casa con jardín
              </button>
              <button 
                @click="sendExampleQuery('Apartamento moderno')"
                class="example-btn"
              >
                Apartamento moderno
              </button>
            </div>
          </div>
        </div>

        <div 
          v-for="(message, index) in messages" 
          :key="index" 
          :class="['message', message.sender]"
        >
          <div class="message-content">
            <div v-if="message.truncated">
              <p v-html="formatMessage(message.showFull ? message.fullText : message.text)"></p>
              <button @click="toggleShowFull(index)" class="text-xs text-gray-500 mt-1">{{ message.showFull ? 'Ver menos' : 'Ver más' }}</button>
            </div>
            <div v-else>
              <p v-html="formatMessage(message.text)"></p>
            </div>
            
            <!-- Mostrar propiedades si las hay -->
            <div v-if="message.properties && message.properties.length > 0" class="properties-grid">
              <div 
                v-for="property in message.properties.slice(0, 3)" 
                :key="property.id"
                class="property-card-mini"
              >
                <img 
                  :src="property.imagen_url || '/placeholder.jpg'" 
                  :alt="property.titulo"
                  class="property-image-mini"
                  loading="lazy"
                />
                <div class="property-info-mini">
                  <h4 class="font-semibold text-sm text-gray-800 leading-tight">{{ property.titulo }}</h4>
                  <p class="text-xs text-gray-600 mb-1">
                    <svg class="w-3 h-3 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {{ property.ubicacion }}
                  </p>
                  <p class="text-gray-700 font-bold text-base">${{ formatPrice(property.precio) }}</p>
                </div>
              </div>
              <div v-if="message.properties.length > 3" class="more-properties-indicator">
                <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                {{ message.properties.length - 3 }} propiedades más disponibles
              </div>
            </div>

            <!-- Keywords si las hay -->
            <div v-if="message.keywords && message.keywords.length > 0" class="keywords-tags">
              <span v-for="keyword in message.keywords" :key="keyword" class="keyword-tag">
                {{ keyword }}
              </span>
            </div>

            <span class="message-time">{{ formatTime(message.timestamp) }}</span>
          </div>
        </div>

        <div v-if="isTyping" class="message bot">
          <div class="message-content typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>

      <!-- Input -->
      <div class="chat-input">
        <textarea
          v-model="currentMessage"
          @keydown.enter.prevent="handleEnter"
          placeholder="¿Qué propiedad busca?"
          rows="1"
          class="message-input"
          :disabled="isTyping"
        ></textarea>
        <button 
          @click="sendCurrentMessage" 
          :disabled="!currentMessage.trim() || isTyping"
          class="send-button"
          aria-label="Enviar mensaje"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted, computed } from 'vue'
import { searchWithIA, searchRealStateWithIA } from '../composables/propertyApiService'
import { useSharedProperties } from '../composables/useSharedProperties'

const isOpen = ref(false)
const messages = ref([])
const currentMessage = ref('')
const isTyping = ref(false)
const unreadCount = ref(0)
const messagesContainer = ref(null)

// Estado compartido para sincronizar con lista de propiedades
const { updatePropertiesFromChat } = useSharedProperties()

// Detectar si hay resultados de búsqueda para expandir el chat
const hasSearchResults = computed(() => {
  return messages.value.some(message => 
    message.properties && message.properties.length > 0
  )
})

// Limitar tamaño de mensajes para evitar uso excesivo de memoria en el cliente
const MAX_MESSAGE_LENGTH = 3000 // caracteres

const pushBotMessage = (payload) => {
  const fullText = (payload.text || '').toString()
  const truncated = fullText.length > MAX_MESSAGE_LENGTH
  const messageText = truncated ? fullText.slice(0, MAX_MESSAGE_LENGTH) + '...' : fullText

  messages.value.push({
    sender: 'bot',
    text: messageText,
    fullText: truncated ? fullText : null,
    truncated: truncated,
    showFull: false,
    properties: payload.properties || [],
    keywords: payload.keywords || [],
    timestamp: new Date()
  })
  
  // Actualizar estado compartido si hay propiedades
  if (payload.properties && payload.properties.length > 0) {
    updatePropertiesFromChat(payload.properties)
  }
}

const toggleShowFull = (index) => {
  const m = messages.value[index]
  if (!m) return
  m.showFull = !m.showFull
}

const quickExamples = [
  'Busco una casa de 3 habitaciones',
  'Apartamentos en el centro',
  'Propiedades con más de 2 baños',
  'Casas de al menos 200 metros cuadrados',
  'Terrenos para inversión'
]

const toggleChat = () => {
  console.log('Toggle chat clicked, current state:', isOpen.value)
  
  if (isOpen.value) {
    // Al cerrar, reiniciar el chat
    messages.value = []
    currentMessage.value = ''
    isTyping.value = false
  }
  
  isOpen.value = !isOpen.value
  console.log('New chat state:', isOpen.value)
  
  if (isOpen.value) {
    unreadCount.value = 0
    nextTick(() => scrollToBottom())
  }
}

const handleEnter = (e) => {
  if (!e.shiftKey) {
    sendCurrentMessage()
  }
}

const sendCurrentMessage = () => {
  if (currentMessage.value.trim() && !isTyping.value) {
    sendMessage(currentMessage.value)
    currentMessage.value = ''
  }
}

const sendExampleQuery = (query) => {
  sendMessage(query)
}

const sendMessage = async (text) => {
  // Agregar mensaje del usuario
  messages.value.push({
    sender: 'user',
    text: text,
    timestamp: new Date()
  })

  await nextTick()
  scrollToBottom()

  // Mostrar indicador de escritura
  isTyping.value = true

  try {
    // Palabras clave para detectar búsquedas de propiedades
    const propertyKeywords = [
      // Tipos de propiedad
      'casa', 'casas', 'apartamento', 'apartamentos', 'propiedad', 'propiedades',
      'departamento', 'departamentos', 'terreno', 'terrenos', 'lote', 'lotes',
      'condominio', 'condominios', 'residencia', 'residencias', 'vivienda', 'viviendas',
      'edificio', 'edificios', 'local', 'locales', 'oficina', 'oficinas',
      'bodega', 'bodegas', 'nave', 'naves', 'penthouse', 'duplex', 'triplex',
      
      // Ubicación y localización
      'ubicación', 'ubicacion', 'zona', 'zonas', 'barrio', 'sector', 'colonia',
      'playa', 'mar', 'costa', 'montaña', 'campo', 'centro', 'afueras',
      'verano', 'vacaciones', 'residencial', 'comercial', 'industrial',
      'norte', 'sur', 'este', 'oeste', 'céntrico', 'centrico',
      'cerca', 'lejos', 'acceso', 'comunicado', 'bien ubicado', 'ubicado',
      
      // Acciones inmobiliarias
      'comprar', 'vender', 'alquilar', 'rentar', 'arrendar',
      'adquirir', 'invertir', 'venta', 'renta', 'alquiler',
      
      // Características físicas y espacios
      'habitaciones', 'habitacion', 'baños', 'baño', 'banos', 'bano',
      'metros', 'm2', 'área', 'area', 'tamaño', 'tamano', 'espacio',
      'recamaras', 'recamara', 'dormitorios', 'dormitorio', 'cuartos', 'cuarto',
      'sala', 'comedor', 'cocina', 'estudio', 'biblioteca',
      'terraza', 'balcón', 'balcon', 'jardín', 'jardin',
      'patio', 'cochera', 'garaje', 'estacionamiento', 'parking',
      'piscina', 'alberca', 'jacuzzi', 'sauna', 'gym', 'gimnasio',
      'lavanderia', 'lavandería', 'bodega', 'cuarto de servicio',
      'sótano', 'sotano', 'ático', 'atico', 'azotea',
      
      // Precio y rangos
      'precio', 'inversión', 'inversion', 'costo', 'vale', 'cuesta',
      'menos', 'más', 'mas', 'entre', 'desde', 'hasta', 'rango',
      'máximo', 'maximo', 'mínimo', 'minimo', 'barato', 'económico', 'economico',
      'caro', 'costoso', 'accesible', 'quetzales', 'dólares', 'dolares',
      'mil', 'millón', 'millon', 'millones', 'presupuesto',
      
      // Intenciones de búsqueda
      'busco', 'necesito', 'quiero', 'estoy buscando', 'buscando',
      'me interesa', 'interesa', 'quisiera', 'deseo', 'requiero',
      'muéstrame', 'muestrame', 'enséñame', 'ensename', 'encuentra',
      'dame', 'quiero ver', 'ver', 'opciones', 'disponible', 'hay',
      
      // Estado y condiciones
      'nuevo', 'nueva', 'usado', 'usada', 'remodelado', 'remodelada',
      'estrenar', 'construcción', 'construccion', 'proyecto',
      'amueblado', 'amueblada', 'equipado', 'equipada',
      'listo', 'lista', 'entrega', 'inmediata',
      
      // Características especiales
      'vista', 'iluminado', 'iluminada', 'amplio', 'amplia',
      'espacioso', 'espaciosa', 'cómodo', 'comodo', 'moderno', 'moderna',
      'lujo', 'lujoso', 'lujosa', 'exclusivo', 'exclusiva',
      'seguridad', 'seguro', 'privado', 'privada', 'vigilancia',
      'pet friendly', 'mascotas', 'permitido', 'acepta',
      
      // Servicios y amenidades
      'agua', 'luz', 'gas', 'internet', 'cable', 'servicios',
      'mantenimiento', 'conserje', 'portero', 'administración', 'administracion',
      'áreas comunes', 'areas comunes', 'salón', 'salon', 'juegos',
      'parque', 'área verde', 'area verde', 'recreación', 'recreacion',
      
      // Palabras que indican ubicación en Guatemala
      'quede en', 'que de en', 'ubicado en', 'en zona', 'en la zona',
      'guatemala', 'mixco', 'antigua', 'villa nueva', 'san lucas',
      'cayalá', 'cayala', 'vista hermosa', 'oakland', 'carretera',
      
      // Números comunes en búsquedas (detecta contexto numérico)
      'una', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho',
      'primer', 'segundo', 'tercer', 'piso', 'nivel', 'planta'
    ]

    // Verificar si la pregunta está relacionada con propiedades
    const lowerText = text.toLowerCase()
    const isPropertyRelated = propertyKeywords.some(keyword => lowerText.includes(keyword))

    let response
    
  if (isPropertyRelated) {
      // Usar búsqueda de propiedades con IA (real state)
      response = await searchRealStateWithIA({
        query: text,
        use_cloud: true
      })

      pushBotMessage({
        text: response.analysis,
        properties: response.properties || [],
        keywords: response.keywords || []
      })
    } else {
      // Usar búsqueda general con IA
      response = await searchWithIA({
        query: text,
        use_cloud: true
      })

      // Verificar si la respuesta incluye propiedades aunque sea búsqueda general
      const hasProperties = response.properties && response.properties.length > 0
      
      pushBotMessage({
        text: response.response || response.analysis,
        properties: hasProperties ? response.properties : [],
        keywords: response.keywords || []
      })
    }

    if (!isOpen.value) {
      unreadCount.value++
    }

  } catch (error) {
    console.error('Error al enviar mensaje:', error)
    
    // Detectar si es un error de base de datos o conexión
    const errorMsg = error.message || ''
    const isDbError = errorMsg.toLowerCase().includes('base de datos') || 
                      errorMsg.toLowerCase().includes('database') ||
                      errorMsg.toLowerCase().includes('conexión') ||
                      errorMsg.toLowerCase().includes('connection') ||
                      errorMsg.toLowerCase().includes('servidor') ||
                      errorMsg.toLowerCase().includes('server')
    
    // Mostrar mensaje de error amigable y personalizado
    let friendlyMessage
    if (isDbError) {
      friendlyMessage = '😊 En este momento no podemos atender tu solicitud. Por favor, intenta más tarde.'
    } else {
      friendlyMessage = errorMsg || 'Lo siento, no puedo procesar tu solicitud en este momento. Por favor, intenta de nuevo en unos momentos.'
    }
    
    messages.value.push({
      sender: 'bot',
      text: friendlyMessage,
      timestamp: new Date()
    })
  } finally {
    isTyping.value = false
    await nextTick()
    scrollToBottom()
  }
}

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

const formatMessage = (text) => {
  // Asegurar texto y convertir saltos de línea a <br>
  if (!text) return ''
  const safeText = text.toString()
  return safeText.replace(/\n/g, '<br>')
}

const formatTime = (date) => {
  return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('es-ES').format(price)
}

onMounted(() => {
  // Mensaje de bienvenida automático después de 1 segundo
  setTimeout(() => {
    if (messages.value.length === 0 && !isOpen.value) {
      unreadCount.value = 1
    }
  }, 1000)
})
</script>

<style scoped>
.chatbox-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
}

.chat-button {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  position: relative;
  backdrop-filter: blur(10px);
}

.chat-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.4);
  border-color: rgba(255, 255, 255, 0.2);
}

.chat-icon-container {
  position: relative;
}

.chat-pulse-ring {
  position: absolute;
  top: -8px;
  left: -8px;
  right: -8px;
  bottom: -8px;
  border: 2px solid rgba(59, 130, 246, 0.3);
  border-radius: 50%;
  animation: chatPulse 2s infinite;
}

@keyframes chatPulse {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(1.2);
    opacity: 0;
  }
}

.chat-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #ef4444;
  color: white;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
}

.chat-window {
  width: 420px;
  min-height: 600px;
  max-height: 80vh;
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: slideUp 0.3s ease;
  transition: all 0.3s ease;
}

.chat-window-expanded {
  width: 450px;
  min-height: 650px;
  max-height: 85vh;
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.chat-header {
  background: linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #2d2d2d 100%);
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  overflow: hidden;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.chat-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.03) 50%, transparent 70%);
  opacity: 0.8;
}

.assistant-avatar {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.status-indicator {
  width: 8px;
  height: 8px;
  background: #10b981;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.close-button {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  z-index: 10;
  position: relative;
}

.close-button:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

.example-questions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
  margin-top: 8px;
}

.example-btn {
  padding: 8px 10px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  color: #475569;
  font-size: 12px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.example-btn:hover {
  background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
  color: white;
  border-color: #0891b2;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(6, 182, 212, 0.3);
}

.example-btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 6px rgba(6, 182, 212, 0.2);
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  background: #f9fafb;
}

.welcome-message {
  animation: fadeIn 0.5s ease;
}

.welcome-icon-container {
  position: relative;
  display: inline-block;
  margin-bottom: 16px;
}

.welcome-sparkles {
  position: absolute;
  top: -5px;
  right: -5px;
  font-size: 14px;
  animation: sparkle 2s infinite;
}

@keyframes sparkle {
  0%, 100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
  50% {
    transform: scale(1.2) rotate(10deg);
    opacity: 0.8;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.message {
  margin-bottom: 16px;
  display: flex;
  animation: messageSlide 0.3s ease;
}

@keyframes messageSlide {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.message.user {
  justify-content: flex-end;
}

.message.bot {
  justify-content: flex-start;
}

.message-content {
  max-width: 75%;
  padding: 12px 16px;
  border-radius: 12px;
  position: relative;
}

.message.user .message-content {
  background: linear-gradient(135deg, #e0f2fe 0%, #b3e5fc 100%);
  color: #0d47a1;
  border-bottom-right-radius: 4px;
  border: 1px solid #81d4fa;
}

.message.bot .message-content {
  background: white;
  color: #374151;
  border-bottom-left-radius: 4px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  border: 1px solid #e5e7eb;
}

.message-time {
  display: block;
  font-size: 10px;
  margin-top: 4px;
  opacity: 0.7;
}

.typing-indicator {
  display: flex;
  gap: 4px;
  padding: 16px;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  background: #9ca3af;
  border-radius: 50%;
  animation: typing 1.4s infinite;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%, 60%, 100% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(-10px);
  }
}

.properties-grid {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: rgba(248, 250, 252, 0.5);
  border-radius: 12px;
  padding: 16px;
  border: 1px solid #e2e8f0;
  max-width: 100%;
}

.property-card-mini {
  display: flex;
  gap: 14px;
  background: #f9fafb;
  border-radius: 10px;
  padding: 14px;
  border: 1px solid #e5e7eb;
  margin: 0;
  transition: all 0.2s ease;
  min-height: 90px;
}

.property-card-mini:hover {
  background: #f3f4f6;
  border-color: #d1d5db;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.property-image-mini {
  width: 90px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  flex-shrink: 0;
}

.property-info-mini {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
  justify-content: space-between;
  min-width: 0;
  padding-right: 4px;
}

.more-properties-indicator {
  text-align: center;
  padding: 8px 12px;
  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
  border-radius: 8px;
  border: 1px dashed #cbd5e1;
  color: #64748b;
  font-size: 12px;
  font-weight: 500;
  margin-top: 4px;
}

.keywords-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 8px;
}

.keyword-tag {
  background: rgba(107, 114, 128, 0.1);
  color: #4b5563;
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
  border: 1px solid rgba(107, 114, 128, 0.2);
}

.chat-input {
  padding: 16px;
  background: white;
  border-top: 1px solid #e5e7eb;
  display: flex;
  gap: 8px;
  align-items: flex-end;
}

.message-input {
  flex: 1;
  border: 2px solid #e2e8f0;
  border-radius: 24px;
  padding: 12px 20px;
  resize: none;
  max-height: 100px;
  font-family: inherit;
  font-size: 14px;
  background: #f8fafc;
  transition: all 0.3s ease;
}

.message-input:focus {
  outline: none;
  border-color: #3b82f6;
  background: white;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.message-input::placeholder {
  color: #94a3b8;
  font-style: italic;
}

.send-button {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  flex-shrink: 0;
  margin-left: 8px;
  box-shadow: 0 2px 8px rgba(107, 114, 128, 0.3);
}

.send-button:hover:not(:disabled) {
  transform: translateY(-1px) scale(1.05);
  box-shadow: 0 4px 12px rgba(107, 114, 128, 0.4);
}

.send-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .chat-window, .chat-window-expanded {
    width: 100vw;
    height: 100vh;
    min-height: 100vh;
    max-height: 100vh;
    border-radius: 0;
    bottom: 0;
    right: 0;
  }
  
  .chatbox-container {
    bottom: 0;
    right: 0;
  }
  
  .properties-grid {
    padding: 14px;
  }
  
  .property-card-mini {
    padding: 12px;
  }
}
</style>
