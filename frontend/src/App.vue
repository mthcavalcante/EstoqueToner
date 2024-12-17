<!-- src/App.vue -->
<template>
  <div class="flex flex-col min-h-screen">
    <!-- Barra de Navegação -->
    <nav class="bg-blue-600 text-white px-4 py-3 flex items-center justify-between">
      <div class="text-lg font-semibold">
        Controle de Estoque de Toners
      </div>
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
export default {
  name: 'App',
  computed: {
    currentYear() {
      return new Date().getFullYear()
    }
  }
}
</script>

<style scoped>

.stock-movement-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.card-title {
  margin-bottom: 1rem;
}

.form-card, .history-card {
  padding: 1.5rem;
}

.add-toner-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.saida-table {
  margin-top: 1rem;
}

.text-right {
  text-align: right;
}

.action-buttons {
  display: flex;
  gap: 1rem;
}

.search-input {
  width: 100%;
}

.no-data {
  text-align: center;
  color: #909399;
  padding: 1rem 0;
}

.additional-fields, .entrada-fields {
  margin-top: 1rem;
}

@media (max-width: 768px) {
  .form-card, .history-card {
    padding: 1rem;
  }

  .el-form-item {
    label-width: 150px;
  }

  .action-buttons {
    flex-direction: column;
  }

  .add-toner-button {
    width: 100%;
    justify-content: center;
  }

  .text-right {
    text-align: center;
  }
}

* {
  user-select: none;
}

.headline {
  font-weight: bold;
}
</style>