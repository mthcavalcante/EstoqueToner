<!-- src/components/TonerForm.vue -->
<template>
  <div class="max-w-2xl mx-auto bg-white shadow-md rounded my-6 p-6">
    <h2 class="text-2xl font-semibold mb-4">{{ isEdit ? 'Editar Toner' : 'Adicionar Toner' }}</h2>
    <form @submit.prevent="saveToner">
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="name">
          Nome do Toner
        </label>
        <input
          id="name"
          type="text"
          v-model="toner.name"
          required
          class="w-full px-3 py-2 border rounded"
        />
      </div>
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="compatible">
          Marca/Modelo Compatível
        </label>
        <input
          id="compatible"
          type="text"
          v-model="toner.compatible"
          required
          class="w-full px-3 py-2 border rounded"
        />
      </div>
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="code">
          Código
        </label>
        <input
          id="code"
          type="text"
          v-model="toner.code"
          required
          class="w-full px-3 py-2 border rounded"
        />
      </div>
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="minLevel">
          Nível Mínimo de Estoque
        </label>
        <input
          id="minLevel"
          type="number"
          v-model.number="toner.minLevel"
          min="0"
          required
          class="w-full px-3 py-2 border rounded"
        />
      </div>
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="currentStock">
          Estoque Atual
        </label>
        <input
          id="currentStock"
          type="number"
          v-model.number="toner.currentStock"
          min="0"
          required
          class="w-full px-3 py-2 border rounded"
        />
      </div>
      <div class="flex items-center justify-between">
        <button
          type="submit"
          class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          {{ isEdit ? 'Atualizar' : 'Adicionar' }}
        </button>
        <router-link
          to="/toners"
          class="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
        >
          Cancelar
        </router-link>
      </div>
    </form>
  </div>
</template>

<script>
import StorageService from '../services/StorageService'

export default {
  name: 'TonerForm',
  props: ['id'],
  data() {
    return {
      toners: [],
      toner: {
        id: null,
        name: '',
        compatible: '',
        code: '',
        minLevel: 0,
        currentStock: 0,
      },
      isEdit: false,
    }
  },
  created() {
    this.toners = StorageService.getData('toners')
    if (this.id) {
      const existingToner = this.toners.find(t => t.id === parseInt(this.id))
      if (existingToner) {
        this.toner = { ...existingToner }
        this.isEdit = true
      }
    }
  },
  methods: {
    saveToner() {
      if (this.isEdit) {
        const index = this.toners.findIndex(t => t.id === this.toner.id)
        if (index !== -1) {
          this.toners.splice(index, 1, this.toner)
        }
      } else {
        this.toner.id = StorageService.generateId(this.toners)
        this.toners.push(this.toner)
      }
      StorageService.setData('toners', this.toners)
      this.$router.push('/toners')
    },
  },
}
</script>

  <style scoped>
  .headline {
    font-weight: bold;
  }
  </style>
  