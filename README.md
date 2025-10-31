# Tienda en línea con Vue.js y FastAPI

Este proyecto es una tienda en línea moderna construida con Vue.js 3 en el frontend y FastAPI en el backend.

## Tecnologías Utilizadas

### Frontend
- Vue.js 3
- Vue Router 4
- Tailwind CSS
- Vite

### Backend
- FastAPI
- Python 3.9
- SQLite (para desarrollo)

## Requisitos

- Docker y Docker Compose
- Node.js 16+ (solo para desarrollo)
- Python 3.9+ (solo para desarrollo)

## Inicio Rápido con Docker

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/tu-usuario/tu-repo.git
   cd tu-repo
   ```

2. Construir y ejecutar con Docker Compose:
   ```bash
   docker compose up --build
   ```

3. Acceder a la aplicación:
   - Frontend: http://localhost:8000
   - Documentación API: http://localhost:8000/docs

## Desarrollo Local

### Frontend

1. Navegar al directorio frontend:
   ```bash
   cd frontend
   ```

2. Instalar dependencias:
   ```bash
   npm install --legacy-peer-deps
   ```

3. Iniciar servidor de desarrollo:
   ```bash
   npm run dev
   ```

### Backend

1. Navegar al directorio backend:
   ```bash
   cd backend
   ```

2. Crear y activar entorno virtual:
   ```bash
   python -m venv venv
   source venv/bin/activate  # En Windows: venv\Scripts\activate
   ```

3. Instalar dependencias:
   ```bash
   pip install -r requirements.txt
   ```

4. Iniciar servidor de desarrollo:
   ```bash
   uvicorn main:app --reload
   ```

## Pruebas

### Frontend
```bash
npm run test
```

### Backend
```bash
pytest
```

## Integración Continua

El proyecto está configurado con GitHub Actions para:
- Construir y probar el frontend
- Construir y probar el backend
- Construir y probar la imagen Docker
- Ejecutar pruebas de integración

## Estructura del Proyecto

```
.
├── frontend/                # Aplicación Vue.js
│   ├── src/
│   │   ├── assets/         # Recursos estáticos
│   │   ├── components/     # Componentes Vue
│   │   ├── router/         # Configuración de Vue Router
│   │   ├── views/          # Vistas/páginas
│   │   └── App.vue         # Componente raíz
│   └── ...
├── backend/                 # API FastAPI
│   ├── main.py             # Punto de entrada
│   └── requirements.txt    # Dependencias Python
├── docker-compose.yml      # Configuración Docker Compose
└── Dockerfile              # Configuración multi-stage build
```

## Contribuir

1. Hacer fork del repositorio
2. Crear una rama para tu feature: `git checkout -b feature/nueva-caracteristica`
3. Commit de tus cambios: `git commit -am 'Añadir nueva característica'`
4. Push a la rama: `git push origin feature/nueva-caracteristica`
5. Crear un Pull Request

## Licencia

MIT