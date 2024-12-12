<!-- src/components/StockReports.vue -->
<template>
  <div class="bg-white shadow-md rounded my-6 p-6">
    <h2 class="text-2xl font-semibold mb-4">Relatórios de Estoque</h2>

    <!-- Estoque Atual -->
    <div class="mb-8">
      <h3 class="text-xl font-semibold mb-4">Estoque Atual</h3>
      <input
        type="text"
        v-model="stockSearch"
        placeholder="Pesquisar toners..."
        class="w-full px-3 py-2 border rounded mb-4"
      />
      <div class="overflow-x-auto">
        <table class="min-w-full bg-white">
          <thead class="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <tr>
              <th class="py-3 px-6 text-left">ID</th>
              <th class="py-3 px-6 text-left">Nome do Toner</th>
              <th class="py-3 px-6 text-left">Estoque Atual</th>
              <th class="py-3 px-6 text-left">Nível Mínimo</th>
            </tr>
          </thead>
          <tbody class="text-gray-600 text-sm font-light">
            <tr
              v-for="toner in filteredStock"
              :key="toner.id"
              class="border-b border-gray-200 hover:bg-gray-100"
            >
              <td class="py-3 px-6 text-left">{{ toner.id }}</td>
              <td class="py-3 px-6 text-left">{{ toner.name }}</td>
              <td class="py-3 px-6 text-left">{{ toner.currentStock }}</td>
              <td class="py-3 px-6 text-left">{{ toner.minLevel }}</td>
            </tr>
            <tr v-if="filteredStock.length === 0">
              <td colspan="4" class="text-center py-4">Nenhum toner encontrado.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Movimentações Recentes -->
    <div>
      <h3 class="text-xl font-semibold mb-4">Movimentações Recentes</h3>
      <input
        type="text"
        v-model="movementSearch"
        placeholder="Pesquisar movimentações..."
        class="w-full px-3 py-2 border rounded mb-4"
      />
      <div class="overflow-x-auto">
        <table class="min-w-full bg-white">
          <thead class="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <tr>
              <th class="py-3 px-6 text-left">ID</th>
              <th class="py-3 px-6 text-left">Toner</th>
              <th class="py-3 px-6 text-left">Tipo</th>
              <th class="py-3 px-6 text-left">Quantidade</th>
              <th class="py-3 px-6 text-left">Motivo</th>
              <th class="py-3 px-6 text-left">Usuário</th>
              <th class="py-3 px-6 text-left">Data</th>
            </tr>
          </thead>
          <tbody class="text-gray-600 text-sm font-light">
            <tr
              v-for="movement in filteredMovements"
              :key="movement.id"
              class="border-b border-gray-200 hover:bg-gray-100"
            >
              <td class="py-3 px-6 text-left">{{ movement.id }}</td>
              <td class="py-3 px-6 text-left">{{ getTonerName(movement.tonerId) }}</td>
              <td class="py-3 px-6 text-left capitalize">{{ movement.type }}</td>
              <td class="py-3 px-6 text-left">{{ movement.quantity }}</td>
              <td class="py-3 px-6 text-left">{{ movement.reason }}</td>
              <td class="py-3 px-6 text-left">{{ movement.user }}</td>
              <td class="py-3 px-6 text-left">{{ movement.date }}</td>
            </tr>
            <tr v-if="filteredMovements.length === 0">
              <td colspan="7" class="text-center py-4">Nenhuma movimentação encontrada.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import StorageService from '../services/StorageService'

export default {
  name: 'StockReports',
  data() {
    return {
      toners: [],
      movements: [],
      stockSearch: '',
      movementSearch: '',
    }
  },
  computed: {
    filteredStock() {
      if (!this.stockSearch) return this.toners
      return this.toners.filter(toner =>
        toner.name.toLowerCase().includes(this.stockSearch.toLowerCase())
      )
    },
    filteredMovements() {
      if (!this.movementSearch) return this.movements
      return this.movements.filter(movement =>
        Object.values(movement).some(value =>
          String(value).toLowerCase().includes(this.movementSearch.toLowerCase())
        )
      )
    },
    recentMovements() {
      return this.movements.slice(-10).reverse()
    }
  },
  created() {
    this.toners = StorageService.getData('toners')
    this.movements = StorageService.getData('movements')
  },
  methods: {
    getTonerName(id) {
      const toner = this.toners.find(t => t.id === id)
      return toner ? toner.name : 'Desconhecido'
    },
  },
}
</script>

<style scoped>
.headline {
  font-weight: bold;
}
</style>
