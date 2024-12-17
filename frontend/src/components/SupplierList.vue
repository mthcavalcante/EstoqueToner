<!-- SupplierList.vue -->
<template>
  <div class="bg-white shadow-md rounded my-6 p-6">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-2xl font-semibold">Lista de Fornecedores</h2>
      <router-link to="/suppliers/add">
        <el-button type="primary">Adicionar Novo Fornecedor</el-button>
      </router-link>
    </div>
    <el-input v-model="search" placeholder="Pesquisar fornecedores..." prefix-icon="el-icon-search" clearable class="mb-4"></el-input>
    <el-table :data="filteredSuppliers" style="width: 100%" border stripe>
      <el-table-column prop="id" label="ID" width="80"></el-table-column>
      <el-table-column prop="company_name" label="Nome da Empresa"></el-table-column>
      <el-table-column prop="contact" label="Contato"></el-table-column>
      <el-table-column prop="whatsapp" label="WhatsApp"></el-table-column>
      <el-table-column prop="address" label="Endereço"></el-table-column>
      <el-table-column label="Ações" width="180">
        <template #default="{ row }">
          <router-link :to="`/suppliers/edit/${row.id}`">
            <el-button type="info">Editar</el-button>
          </router-link>
          <el-button type="danger" @click="deleteSupplier(row.id)">Excluir</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-if="filteredSuppliers.length === 0" class="text-center mt-4">
      Nenhum fornecedor encontrado.
    </div>
  </div>
</template>

<script>
import ApiService from '../services/ApiService'

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
      const searchTerm = this.search.toLowerCase()
      return this.suppliers.filter(supplier =>
        supplier.company_name.toLowerCase().includes(searchTerm) ||
        supplier.contact.toLowerCase().includes(searchTerm)
      )
    }
  },
  created() {
    this.loadSuppliers()
  },
  methods: {
    loadSuppliers() {
      ApiService.getSuppliers()
        .then(response => {
          this.suppliers = response.data
        })
        .catch(() => {
          this.$message.error('Erro ao carregar fornecedores.')
        })
    },
    deleteSupplier(id) {
      this.$confirm('Tem certeza que deseja excluir este fornecedor?', 'Confirmação', {
        confirmButtonText: 'Sim',
        cancelButtonText: 'Não',
        type: 'warning',
      }).then(() => {
        ApiService.deleteSupplier(id)
          .then(() => {
            this.suppliers = this.suppliers.filter(supplier => supplier.id !== id)
            this.$message.success('Fornecedor excluído com sucesso!')
          })
          .catch(() => {
            this.$message.error('Erro ao excluir fornecedor.')
          })
      }).catch(() => {
        // Ação cancelada
      })
    },
  },
}
</script>

<style scoped>
</style>
