<!-- src/components/TonerList.vue -->
<template>
  <div class="bg-white shadow-md rounded my-6">
    <div class="px-6 py-4 border-b">
      <div class="flex justify-between items-center">
        <h2 class="text-xl font-semibold">Lista de Toners</h2>
        <router-link
          to="/toners/add"
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Adicionar Novo Toner
        </router-link>
      </div>
      <div class="mt-4">
        <input
          type="text"
          v-model="search"
          placeholder="Pesquisar toners..."
          class="w-full px-3 py-2 border rounded"
        />
      </div>
    </div>
    <div class="overflow-x-auto">
      <table class="min-w-full bg-white">
        <thead class="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
          <tr>
            <th class="py-3 px-6 text-left">ID</th>
            <th class="py-3 px-6 text-left">Nome do Toner</th>
            <th class="py-3 px-6 text-left">Marca/Modelo Compatível</th>
            <th class="py-3 px-6 text-left">Código</th>
            <th class="py-3 px-6 text-left">Nível Mínimo</th>
            <th class="py-3 px-6 text-left">Estoque Atual</th>
            <th class="py-3 px-6 text-left">Ações</th>
          </tr>
        </thead>
        <tbody class="text-gray-600 text-sm font-light">
          <tr
            v-for="toner in filteredToners"
            :key="toner.id"
            class="border-b border-gray-200 hover:bg-gray-100"
          >
            <td class="py-3 px-6 text-left">{{ toner.id }}</td>
            <td class="py-3 px-6 text-left">{{ toner.name }}</td>
            <td class="py-3 px-6 text-left">{{ toner.compatible }}</td>
            <td class="py-3 px-6 text-left">{{ toner.code }}</td>
            <td class="py-3 px-6 text-left">{{ toner.minLevel }}</td>
            <td class="py-3 px-6 text-left">{{ toner.currentStock }}</td>
            <td class="py-3 px-6 text-left space-x-2">
              <router-link
                :to="`/toners/edit/${toner.id}`"
                class="text-blue-500 hover:text-blue-700"
              >
                Editar
              </router-link>
              <button
                @click="deleteToner(toner.id)"
                class="text-red-500 hover:text-red-700"
              >
                Excluir
              </button>
            </td>
          </tr>
          <tr v-if="filteredToners.length === 0">
            <td colspan="7" class="text-center py-4">Nenhum toner encontrado.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import StorageService from '../services/StorageService'

export default {
  name: 'TonerList',
  data() {
    return {
      toners: [],
      search: '',
    }
  },
  computed: {
    filteredToners() {
      if (!this.search) return this.toners
      return this.toners.filter(toner =>
        toner.name.toLowerCase().includes(this.search.toLowerCase())
      )
    }
  },
  created() {
    this.loadToners()
  },
  methods: {
    loadToners() {
      this.toners = StorageService.getData('toners')
    },
    deleteToner(id) {
      if (confirm('Tem certeza que deseja excluir este toner?')) {
        this.toners = this.toners.filter(toner => toner.id !== id)
        StorageService.setData('toners', this.toners)
      }
    },
  },
}
</script>

<style scoped>
.headline {
  font-weight: bold;
}
</style>
