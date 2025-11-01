# 💬 ChatBox IA - Documentación

## 🎯 Características

El ChatBox es un asistente inteligente que se conecta a los endpoints de IA del backend para proporcionar:

### ✨ Funcionalidades Principales

1. **Búsqueda Inteligente de Propiedades**
   - Detecta automáticamente preguntas sobre propiedades
   - Usa IA para extraer keywords de la consulta
   - Filtra propiedades de la base de datos
   - Muestra resultados con análisis inteligente

2. **Asistente General**
   - Responde preguntas generales sobre bienes raíces
   - Proporciona información y recomendaciones
   - Usa el modelo deepseek-v3.1:671b-cloud

3. **Interfaz Interactiva**
   - Botón flotante en la esquina inferior derecha
   - Contador de mensajes no leídos
   - Indicador de "escribiendo..."
   - Tarjetas de propiedades integradas
   - Keywords visuales
   - Ejemplos de preguntas rápidas

## 🔌 Endpoints Utilizados

### 1. `/api/search-ia`
Búsqueda general con IA

**Request:**
```json
{
  "query": "¿Cuáles son las mejores zonas para invertir?",
  "context": "opcional",
  "use_cloud": true
}
```

**Response:**
```json
{
  "response": "Las mejores zonas para invertir son...",
  "metadata": {
    "model_used": "deepseek-v3.1:671b-cloud",
    "query": "...",
    "is_cloud": true
  }
}
```

### 2. `/api/search-ia-real-state`
Búsqueda de propiedades con IA

**Request:**
```json
{
  "query": "Busco una casa con 3 habitaciones",
  "use_cloud": true
}
```

**Response:**
```json
{
  "properties": [
    {
      "id": 1,
      "titulo": "Casa moderna...",
      "precio": 250000,
      ...
    }
  ],
  "keywords": ["casa", "habitaciones", "3"],
  "analysis": "Encontré 5 propiedades que coinciden...",
  "metadata": {
    "model_used": "deepseek-v3.1:671b-cloud",
    "total_properties_db": 50,
    "filtered_properties": 5
  }
}
```

## 🛠️ Componentes

### `ChatBox.vue`
Componente principal del chatbox

**Props:** Ninguno (completamente autónomo)

**Características:**
- Estado abierto/cerrado con animaciones
- Auto-scroll a último mensaje
- Detección inteligente del tipo de consulta
- Formato de mensajes con HTML
- Tarjetas mini de propiedades
- Tags de keywords
- Ejemplos de consultas rápidas

### `propertyApiService.js`
Servicio actualizado con nuevos métodos:

```javascript
// Búsqueda general con IA
searchWithIA({ query, context?, use_cloud })

// Búsqueda de propiedades con IA
searchRealStateWithIA({ query, use_cloud })
```

## 🎨 Estilos y Animaciones

- **Colores:** Gradiente púrpura-azul (#667eea → #764ba2)
- **Animaciones:**
  - slideUp: Aparición del chatbox
  - fadeIn: Mensaje de bienvenida
  - messageSlide: Nuevos mensajes
  - typing: Indicador de escritura
  - pulse: Indicador de estado en línea

- **Responsive:** Se adapta a móviles (fullscreen en pantallas pequeñas)

## 🚀 Uso

### Instalación
Ya está integrado en `App.vue`, solo necesitas tener el backend corriendo.

### Ejemplos de Consultas

**Búsqueda de Propiedades:**
- "¿Qué casas tienes disponibles?"
- "Busco un apartamento en el centro"
- "Muéstrame propiedades con piscina"
- "Casas de 3 habitaciones bajo $200,000"

**Consultas Generales:**
- "¿Cuáles son las mejores zonas para vivir?"
- "¿Cómo funciona el proceso de compra?"
- "Consejos para invertir en bienes raíces"

## 🔍 Detección Automática

El chatbox detecta automáticamente si usar búsqueda de propiedades basándose en palabras clave:

```javascript
const usesPropertySearch = text.includes('casa') || 
                          text.includes('apartamento') ||
                          text.includes('propiedad') ||
                          text.includes('busco') ||
                          text.includes('zona')
```

## 📱 Estados del Chat

1. **Cerrado:** Botón flotante visible
2. **Abierto - Vacío:** Mensaje de bienvenida + ejemplos
3. **Conversación:** Mensajes del usuario y bot
4. **Escribiendo:** Indicador de 3 puntos animados
5. **Con Propiedades:** Tarjetas mini de resultados
6. **Con Keywords:** Tags de palabras clave

## ⚙️ Configuración

### Variables de Entorno
El chatbox usa la configuración de API del proyecto:

```javascript
// config/api.js
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'
```

### Personalización

**Cambiar color del gradiente:**
```css
background: linear-gradient(135deg, #TU_COLOR_1 0%, #TU_COLOR_2 100%);
```

**Cambiar tamaño del chat:**
```css
.chat-window {
  width: 380px;  /* Ancho */
  height: 600px; /* Alto */
}
```

**Agregar más ejemplos:**
```javascript
const quickExamples = [
  'Tu ejemplo 1',
  'Tu ejemplo 2',
  'Tu ejemplo 3'
]
```

## 🐛 Debugging

### Ver requests en consola:
El componente usa `console.error` para errores. Abre DevTools para ver detalles.

### Verificar endpoints:
```bash
# Backend debe estar corriendo
http://localhost:8000/docs

# Probar endpoint directamente
curl -X POST http://localhost:8000/api/search-ia \
  -H "Content-Type: application/json" \
  -d '{"query":"hola","use_cloud":true}'
```

## 🎯 Próximas Mejoras

- [ ] Historial de conversaciones (localStorage)
- [ ] Soporte para imágenes
- [ ] Compartir conversación
- [ ] Modo oscuro
- [ ] Notificaciones de escritorio
- [ ] Integración con WebSocket para tiempo real
- [ ] Sugerencias de búsqueda mientras escribe
- [ ] Exportar conversación a PDF

## 📝 Notas Técnicas

- **Framework:** Vue 3 Composition API
- **Estilos:** CSS Scoped + Tailwind utilities
- **Iconos:** SVG inline (heroicons)
- **Animaciones:** CSS animations nativas
- **API:** Async/await con manejo de errores
- **Scroll:** Auto-scroll con nextTick()
