<!-- src/components/SupplierList.vue -->
<template>
  <div class="bg-white shadow-md rounded my-6">
    <div class="px-6 py-4 border-b">
      <div class="flex justify-between items-center">
        <h2 class="text-xl font-semibold">Lista de Fornecedores</h2>
        <router-link
          to="/suppliers/add"
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Adicionar Novo Fornecedor
        </router-link>
      </div>
      <div class="mt-4">
        <input
          type="text"
          v-model="search"
          placeholder="Pesquisar fornecedores..."
          class="w-full px-3 py-2 border rounded"
        />
      </div>
    </div>
    <div class="overflow-x-auto">
      <table class="min-w-full bg-white">
        <thead class="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
          <tr>
            <th class="py-3 px-6 text-left">ID</th>
            <th class="py-3 px-6 text-left">Nome da Empresa</th>
            <th class="py-3 px-6 text-left">Contato</th>
            <th class="py-3 px-6 text-left">WhatsApp</th>
            <th class="py-3 px-6 text-left">Endereço</th>
            <th class="py-3 px-6 text-left">Ações</th>
          </tr>
        </thead>
        <tbody class="text-gray-600 text-sm font-light">
          <tr
            v-for="supplier in filteredSuppliers"
            :key="supplier.id"
            class="border-b border-gray-200 hover:bg-gray-100"
          >
            <td class="py-3 px-6 text-left">{{ supplier.id }}</td>
            <td class="py-3 px-6 text-left">{{ supplier.companyName }}</td>
            <td class="py-3 px-6 text-left">{{ supplier.contact }}</td>
            <td class="py-3 px-6 text-left">{{ supplier.whatsapp }}</td>
            <td class="py-3 px-6 text-left">{{ supplier.address }}</td>
            <td class="py-3 px-6 text-left space-x-2">
              <router-link
                :to="`/suppliers/edit/${supplier.id}`"
                class="text-blue-500 hover:text-blue-700"
              >
                Editar
              </router-link>
              <button
                @click="deleteSupplier(supplier.id)"
                class="text-red-500 hover:text-red-700"
              >
                Excluir
              </button>
            </td>
          </tr>
          <tr v-if="filteredSuppliers.length === 0">
            <td colspan="6" class="text-center py-4">Nenhum fornecedor encontrado.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import StorageService from '../services/StorageService'

export default {
  name: 'SupplierList',
  data() {
    return {
      suppliers: [],
      search: '',
    }
  },
  computed: {
    filteredSuppliers() {
      if (!this.search) return this.suppliers
      return this.suppliers.filter(supplier =>
        supplier.companyName.toLowerCase().includes(this.search.toLowerCase())
      )
    }
  },
  created() {
    this.loadSuppliers()
  },
  methods: {
    loadSuppliers() {
      this.suppliers = StorageService.getData('suppliers')
    },
    deleteSupplier(id) {
      if (confirm('Tem certeza que deseja excluir este fornecedor?')) {
        this.suppliers = this.suppliers.filter(supplier => supplier.id !== id)
        StorageService.setData('suppliers', this.suppliers)
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
