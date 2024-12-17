<!-- StockReports.vue -->
<template>
  <div class="bg-white shadow-md rounded my-6 p-6">
    <h1 class="text-3xl font-bold mb-6">Relatórios de Estoque</h1>

    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Estoque Atual</h2>
      <el-input v-model="stockSearch" placeholder="Pesquisar toners..." prefix-icon="el-icon-search" clearable class="mb-4"></el-input>
      <el-table :data="filteredStock" style="width: 100%" border stripe>
        <el-table-column prop="id" label="ID" width="80"></el-table-column>
        <el-table-column prop="name" label="Nome do Toner"></el-table-column>
        <el-table-column prop="current_stock" label="Estoque Atual"></el-table-column>
        <el-table-column prop="min_level" label="Nível Mínimo"></el-table-column>
      </el-table>
      <div v-if="filteredStock.length === 0" class="text-center mt-4">
        Nenhum toner encontrado.
      </div>
    </div>

    <div>
      <h2 class="text-2xl font-semibold mb-4">Movimentações Recentes</h2>
      <el-input v-model="movementSearch" placeholder="Pesquisar movimentações..." prefix-icon="el-icon-search" clearable class="mb-4"></el-input>
      <el-table :data="filteredMovements" style="width: 100%" border stripe>
        <el-table-column prop="id" label="ID" width="80"></el-table-column>
        <el-table-column label="Tipo">
          <template #default="{ row }">
            {{ capitalize(row.type) }}
          </template>
        </el-table-column>
        <el-table-column label="Toner">
          <template #default="{ row }">
            {{ getTonerName(row.toner_id) }}
          </template>
        </el-table-column>
        <el-table-column prop="quantity" label="Quantidade" width="100"></el-table-column>
        <el-table-column prop="reason" label="Motivo"></el-table-column>
        <el-table-column prop="technician" label="Técnico Responsável"></el-table-column>
        <el-table-column prop="person_name" label="Pessoa que Pegou" width="150">
          <template #default="{ row }">
            <span v-if="row.type === 'saida'">{{ row.person_name }}</span>
            <span v-else>—</span>
          </template>
        </el-table-column>
        <el-table-column prop="printer" label="Impressora" width="150">
          <template #default="{ row }">
            <span v-if="row.type === 'saida'">{{ row.printer ? row.printer.name : 'Não informado' }}</span>
            <span v-else>—</span>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="Data">
          <template #default="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </el-table-column>
      </el-table>
      <div v-if="filteredMovements.length === 0" class="text-center mt-4">
        Nenhuma movimentação encontrada.
      </div>
    </div>
  </div>
</template>

<script>
import ApiService from '../services/ApiService'
import dayjs from 'dayjs'

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
      const searchTerm = this.stockSearch.toLowerCase()
      return this.toners.filter(toner =>
        toner.name.toLowerCase().includes(searchTerm) ||
        toner.code.toLowerCase().includes(searchTerm)
      )
    },
    filteredMovements() {
      if (!this.movementSearch) return this.movements
      const searchTerm = this.movementSearch.toLowerCase()
      return this.movements.filter(movement =>
        Object.values(movement).some(value =>
          String(value).toLowerCase().includes(searchTerm)
        )
      )
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    loadData() {
      this.loadToners()
      this.loadMovements()
    },
    loadToners() {
      ApiService.getToners()
        .then(response => {
          this.toners = response.data
        })
        .catch(() => {
          this.$message.error('Erro ao carregar toners.')
        })
    },
    loadMovements() {
      ApiService.getMovements()
        .then(response => {
          this.movements = response.data
        })
        .catch(() => {
          this.$message.error('Erro ao carregar movimentações.')
        })
    },
    getTonerName(id) {
      const toner = this.toners.find(t => t.id === id)
      return toner ? toner.name : 'Desconhecido'
    },
    capitalize(word) {
      if (!word) return ''
      return word.charAt(0).toUpperCase() + word.slice(1)
    },
    formatDate(dateStr) {
      if (!dateStr) return 'Data não disponível'
      const date = dayjs(dateStr)
      return date.isValid() ? date.format('DD/MM/YYYY HH:mm') : 'Data inválida'
    }
  },
}
</script>

<style scoped>
</style>
