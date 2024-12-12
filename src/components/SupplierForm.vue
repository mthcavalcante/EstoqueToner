<!-- src/components/SupplierForm.vue -->
<template>
  <div class="max-w-2xl mx-auto bg-white shadow-md rounded my-6 p-6">
    <h2 class="text-2xl font-semibold mb-4">{{ isEdit ? 'Editar Fornecedor' : 'Adicionar Fornecedor' }}</h2>
    <form @submit.prevent="saveSupplier">
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="companyName">
          Nome da Empresa
        </label>
        <input
          id="companyName"
          type="text"
          v-model="supplier.companyName"
          required
          class="w-full px-3 py-2 border rounded"
        />
      </div>
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="contact">
          Contato Responsável
        </label>
        <input
          id="contact"
          type="text"
          v-model="supplier.contact"
          required
          class="w-full px-3 py-2 border rounded"
        />
      </div>
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="whatsapp">
          Número de WhatsApp
        </label>
        <input
          id="whatsapp"
          type="text"
          v-model="supplier.whatsapp"
          required
          class="w-full px-3 py-2 border rounded"
        />
      </div>
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="address">
          Endereço
        </label>
        <input
          id="address"
          type="text"
          v-model="supplier.address"
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
          to="/suppliers"
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
  name: 'SupplierForm',
  props: ['id'],
  data() {
    return {
      suppliers: [],
      supplier: {
        id: null,
        companyName: '',
        contact: '',
        whatsapp: '',
        address: '',
      },
      isEdit: false,
    }
  },
  created() {
    this.suppliers = StorageService.getData('suppliers')
    if (this.id) {
      const existingSupplier = this.suppliers.find(s => s.id === parseInt(this.id))
      if (existingSupplier) {
        this.supplier = { ...existingSupplier }
        this.isEdit = true
      }
    }
  },
  methods: {
    saveSupplier() {
      if (this.isEdit) {
        const index = this.suppliers.findIndex(s => s.id === this.supplier.id)
        if (index !== -1) {
          this.suppliers.splice(index, 1, this.supplier)
        }
      } else {
        this.supplier.id = StorageService.generateId(this.suppliers)
        this.suppliers.push(this.supplier)
      }
      StorageService.setData('suppliers', this.suppliers)
      this.$router.push('/suppliers')
    },
  },
}
</script>

<style scoped>
.headline {
  font-weight: bold;
}
</style>
