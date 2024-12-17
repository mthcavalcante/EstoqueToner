<!-- TonerList.vue -->
<template>
  <div class="bg-white shadow-md rounded my-6 p-6">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-2xl font-semibold">Lista de Toners</h2>
      <router-link to="/toners/add">
        <el-button type="primary">Adicionar Novo Toner</el-button>
      </router-link>
    </div>
    <el-input v-model="search" placeholder="Pesquisar toners..." prefix-icon="el-icon-search" clearable class="mb-4"></el-input>
    <el-table :data="filteredToners" style="width: 100%" border stripe>
      <el-table-column prop="id" label="ID" width="80"></el-table-column>
      <el-table-column prop="name" label="Nome do Toner"></el-table-column>
      <el-table-column prop="compatible" label="Marca/Modelo Compatível"></el-table-column>
      <el-table-column prop="code" label="Código"></el-table-column>
      <el-table-column prop="current_stock" label="Estoque Atual"></el-table-column>
      <el-table-column prop="min_level" label="Nível Mínimo"></el-table-column>
      <el-table-column label="Ações" width="180">
        <template #default="{ row }">
          <router-link :to="`/toners/edit/${row.id}`">
            <el-button type="info">Editar</el-button>
          </router-link>
          <el-button type="danger" @click="deleteToner(row.id)">Excluir</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-if="filteredToners.length === 0" class="text-center mt-4">
      Nenhum toner encontrado.
    </div>
  </div>
</template>

<script>
import ApiService from '../services/ApiService'

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
      const term = this.search.toLowerCase()
      return this.toners.filter(toner =>
        toner.name.toLowerCase().includes(term) ||
        toner.code.toLowerCase().includes(term)
      )
    }
  },
  created() {
    this.loadToners()
  },
  methods: {
    loadToners() {
      ApiService.getToners()
        .then(response => {
          this.toners = response.data
        })
        .catch(() => {
          this.$message.error('Erro ao carregar toners.')
        })
    },
    deleteToner(id) {
      this.$confirm('Tem certeza que deseja excluir este toner?', 'Confirmação', {
        confirmButtonText: 'Sim',
        cancelButtonText: 'Não',
        type: 'warning',
      }).then(() => {
        ApiService.deleteToner(id)
          .then(() => {
            this.toners = this.toners.filter(toner => toner.id !== id)
            this.$message.success('Toner excluído com sucesso!')
          })
          .catch(() => {
            this.$message.error('Erro ao excluir toner.')
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
