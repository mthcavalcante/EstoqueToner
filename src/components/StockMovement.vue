<!-- src/components/StockMovement.vue -->
<template>
  <div class="bg-white shadow-md rounded my-6 p-6">
    <h2 class="text-2xl font-semibold mb-4">Movimentação de Estoque</h2>
    <form @submit.prevent="recordMovement" class="mb-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Toner -->
        <div>
          <label class="block text-gray-700 text-sm font-bold mb-2" for="toner">
            Toner
          </label>
          <select
            id="toner"
            v-model="movement.tonerId"
            required
            class="w-full px-3 py-2 border rounded"
          >
            <option disabled value="">Selecione um toner</option>
            <option v-for="toner in toners" :key="toner.id" :value="toner.id">
              {{ toner.name }}
            </option>
          </select>
        </div>

        <!-- Tipo de Movimentação -->
        <div>
          <label class="block text-gray-700 text-sm font-bold mb-2" for="type">
            Tipo de Movimentação
          </label>
          <select
            id="type"
            v-model="movement.type"
            required
            class="w-full px-3 py-2 border rounded"
          >
            <option disabled value="">Selecione o tipo</option>
            <option v-for="type in movementTypes" :key="type" :value="type">
              {{ type.charAt(0).toUpperCase() + type.slice(1) }}
            </option>
          </select>
        </div>

        <!-- Quantidade -->
        <div>
          <label class="block text-gray-700 text-sm font-bold mb-2" for="quantity">
            Quantidade
          </label>
          <input
            id="quantity"
            type="number"
            v-model.number="movement.quantity"
            min="1"
            required
            class="w-full px-3 py-2 border rounded"
          />
        </div>

        <!-- Motivo -->
        <div>
          <label class="block text-gray-700 text-sm font-bold mb-2" for="reason">
            Motivo
          </label>
          <input
            id="reason"
            type="text"
            v-model="movement.reason"
            required
            class="w-full px-3 py-2 border rounded"
          />
        </div>

        <!-- Usuário Responsável -->
        <div>
          <label class="block text-gray-700 text-sm font-bold mb-2" for="user">
            Usuário Responsável
          </label>
          <input
            id="user"
            type="text"
            v-model="movement.user"
            required
            class="w-full px-3 py-2 border rounded"
          />
        </div>
      </div>
      <div class="flex items-center justify-between mt-4">
        <button
          type="submit"
          class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Registrar Movimentação
        </button>
        <button
          type="button"
          @click="resetForm"
          class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
        >
          Limpar
        </button>
      </div>
    </form>

    <h3 class="text-xl font-semibold mb-4">Histórico de Movimentações</h3>
    <input
      type="text"
      v-model="search"
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
</template>

<script>
import StorageService from '../services/StorageService'

export default {
  name: 'StockMovement',
  data() {
    return {
      toners: [],
      movements: [],
      movement: {
        id: null,
        tonerId: null,
        type: 'entrada',
        quantity: 1,
        reason: '',
        user: '',
        date: '',
      },
      movementTypes: ['entrada', 'saida'],
      search: '',
    }
  },
  computed: {
    filteredMovements() {
      if (!this.search) return this.movements
      return this.movements.filter(movement =>
        Object.values(movement).some(value =>
          String(value).toLowerCase().includes(this.search.toLowerCase())
        )
      )
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
    recordMovement() {
      // Validação de estoque para saídas
      if (this.movement.type === 'saida') {
        const toner = this.toners.find(t => t.id === this.movement.tonerId)
        if (toner) {
          if (toner.currentStock < this.movement.quantity) {
            alert('Estoque insuficiente para esta movimentação.')
            return
          }
          toner.currentStock -= this.movement.quantity
        }
      } else if (this.movement.type === 'entrada') {
        const toner = this.toners.find(t => t.id === this.movement.tonerId)
        if (toner) {
          toner.currentStock += this.movement.quantity
        }
      }

      // Atualizar estoque
      StorageService.setData('toners', this.toners)

      // Registrar movimentação
      this.movement.id = StorageService.generateId(this.movements)
      this.movement.date = new Date().toLocaleString()
      this.movements.push({ ...this.movement })
      StorageService.setData('movements', this.movements)

      // Resetar formulário
      this.resetForm()
    },
    resetForm() {
      this.movement = {
        id: null,
        tonerId: null,
        type: 'entrada',
        quantity: 1,
        reason: '',
        user: '',
        date: '',
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
