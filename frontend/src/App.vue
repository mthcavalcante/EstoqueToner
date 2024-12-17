<!-- src/App.vue -->
<template>
  <div class="flex flex-col min-h-screen">
    <!-- Barra de Navegação -->
    <nav class="bg-blue-600 text-white px-4 py-3 flex items-center justify-between">
      <!-- Logotipo da Empresa -->
      <div class="flex items-center">
        <router-link to="/">
          <img :src="logo" alt="Logo da Empresa" class="h-12 mr-3" />
        </router-link>
        <span class="text-lg font-semibold">
          Controle de Estoque de Toners
        </span>
      </div>
      
      <!-- Menu de Navegação -->
      <div class="space-x-4 flex items-center">
        <router-link to="/dashboard" class="hover:underline">Dashboard</router-link>
        <router-link to="/toners" class="hover:underline">Toners</router-link>
        <router-link to="/suppliers" class="hover:underline">Fornecedores</router-link>
        <router-link to="/movements" class="hover:underline">Movimentações</router-link>
        <router-link to="/reports" class="hover:underline">Relatórios</router-link>
        <router-link to="/printers" class="hover:underline">Impressoras</router-link>
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
import logo from '@/assets/logo.png' // Certifique-se de que o caminho está correto e a imagem está na pasta src/assets

export default {
  name: 'App',
  data() {
    return {
      logo, // Adiciona o logotipo ao data para uso no template
    }
  },
  computed: {
    currentYear() {
      return new Date().getFullYear()
    }
  }
}
</script>

<style scoped>
/* Estilos Utilitários */
.flex {
  display: flex;
}

.flex-col {
  flex-direction: column;
}

.min-h-screen {
  min-height: 100vh;
}

.bg-blue-600 {
  background-color: #3182ce;
}

.text-white {
  color: #ffffff;
}

.px-4 {
  padding-left: 1rem;
  padding-right: 1rem;
}

.py-3 {
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
}

.items-center {
  align-items: center;
}

.justify-between {
  justify-content: space-between;
}

.text-lg {
  font-size: 1.125rem;
}

.font-semibold {
  font-weight: 600;
}

.space-x-4 > * + * {
  margin-left: 1rem;
}

.hover\:underline:hover {
  text-decoration: underline;
}

.container {
  max-width: 1200px;
}

.mx-auto {
  margin-left: auto;
  margin-right: auto;
}

.p-4 {
  padding: 1rem;
}

.h-12 {
  height: 3rem; /* Ajuste a altura conforme necessário */
}

.mr-3 {
  margin-right: 0.75rem;
}

@media (max-width: 640px) {
  /* Ajustes responsivos para telas menores, se necessário */
  .text-lg {
    font-size: 1rem;
  }

  .h-12 {
    height: 2.5rem;
  }
}

* {user-select: none}
</style>
