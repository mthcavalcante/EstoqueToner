<!-- PrinterList.vue -->
<template>
    <div class="bg-white shadow-md rounded my-6 p-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-semibold">Lista de Impressoras</h2>
        <router-link to="/printers/add">
          <el-button type="primary">Adicionar Nova Impressora</el-button>
        </router-link>
      </div>
      <el-input v-model="search" placeholder="Pesquisar impressoras..." prefix-icon="el-icon-search" clearable class="mb-4"></el-input>
      <el-table :data="filteredPrinters" style="width: 100%" border stripe>
        <el-table-column prop="id" label="ID" width="80"></el-table-column>
        <el-table-column prop="name" label="Nome da Impressora"></el-table-column>
        <el-table-column prop="location" label="Localização"></el-table-column>
        <el-table-column label="Ações" width="180">
          <template #default="{ row }">
            <router-link :to="`/printers/edit/${row.id}`">
              <el-button type="info">Editar</el-button>
            </router-link>
            <el-button type="danger" @click="deletePrinter(row.id)">Excluir</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div v-if="filteredPrinters.length === 0" class="text-center mt-4">
        Nenhuma impressora encontrada.
      </div>
    </div>
  </template>
  
  <script>
  import ApiService from '../services/ApiService'
  
  export default {
    name: 'PrinterList',
    data() {
      return {
        printers: [],
        search: '',
      }
    },
    computed: {
      filteredPrinters() {
        if (!this.search) return this.printers
        const searchTerm = this.search.toLowerCase()
        return this.printers.filter(printer =>
          printer.name.toLowerCase().includes(searchTerm) ||
          (printer.location && printer.location.toLowerCase().includes(searchTerm))
        )
      }
    },
    created() {
      this.loadPrinters()
    },
    methods: {
      loadPrinters() {
        ApiService.getPrinters()
          .then(response => {
            this.printers = response.data
          })
          .catch(() => {
            this.$message.error('Erro ao carregar impressoras.')
          })
      },
      deletePrinter(id) {
        this.$confirm('Tem certeza que deseja excluir esta impressora?', 'Confirmação', {
          confirmButtonText: 'Sim',
          cancelButtonText: 'Não',
          type: 'warning',
        }).then(() => {
          ApiService.deletePrinter(id)
            .then(() => {
              this.printers = this.printers.filter(p => p.id !== id)
              this.$message.success('Impressora excluída com sucesso!')
            })
            .catch(() => {
              this.$message.error('Erro ao excluir a impressora.')
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
  