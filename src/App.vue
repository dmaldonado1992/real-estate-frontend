<template>
  <div class="min-h-screen bg-gray-100">
    <nav class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex justify-between h-16">
          <div class="flex">
            <router-link to="/" class="flex-shrink-0 flex items-center">
              <span class="text-xl font-bold text-gray-800">Mi Aplicación</span>
            </router-link>
            <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
              <router-link to="/" class="inline-flex items-center px-1 pt-1 text-gray-900">
                Inicio
              </router-link>
              <router-link to="/products" class="inline-flex items-center px-1 pt-1 text-gray-500 hover:text-gray-900">
                Productos
              </router-link>
              <router-link to="/about" class="inline-flex items-center px-1 pt-1 text-gray-500 hover:text-gray-900">
                Acerca de
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup>
// Componente usando la Composition API
</script>