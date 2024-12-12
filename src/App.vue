<!-- src/App.vue -->
<template>
  <div class="flex flex-col min-h-screen">
    <!-- Barra de Navegação -->
    <nav class="bg-blue-600 text-white px-4 py-3 flex items-center justify-between">
      <div class="text-lg font-semibold">
        Controle de Estoque de Toners
      </div>
      <div class="space-x-4">
        <router-link to="/toners" class="hover:underline">Toners</router-link>
        <router-link to="/suppliers" class="hover:underline">Fornecedores</router-link>
        <router-link to="/movements" class="hover:underline">Movimentações</router-link>
        <router-link to="/reports" class="hover:underline">Relatórios</router-link>
      </div>
    </nav>

    <!-- Conteúdo Principal -->
    <main class="flex-grow container mx-auto p-4">
      <router-view />
    </main>

    <!-- Rodapé -->
    <footer class="bg-gray-800 text-white text-center py-4">
      © {{ currentYear }} Controle de Estoque de Toners
    </footer>
  </div>
</template>

<script>
export default {
  name: 'App',
  computed: {
    currentYear() {
      return new Date().getFullYear()
    }
  }
}
</script>

<style>
/* Você pode adicionar estilos personalizados aqui */
</style>
