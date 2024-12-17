<!-- BulkEntryForm.vue -->
<template>
    <div class="max-w-3xl mx-auto bg-white shadow-md rounded my-6 p-6">
      <h2 class="text-2xl font-semibold mb-4">Entrada Múltipla de Toners</h2>
      <p class="mb-4">Adicione várias entradas de toner ao mesmo tempo.</p>
  
      <el-button type="primary" class="mb-4" @click="addEntry">Adicionar Linha</el-button>
      
      <el-table :data="entries" style="width: 100%" border stripe>
        <el-table-column label="Toner">
          <template #default="{ row }">
            <el-select v-model="row.toner_id" placeholder="Selecione um toner">
              <el-option v-for="toner in toners" :key="toner.id" :label="toner.name" :value="toner.id"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="Quantidade" width="100">
          <template #default="{ row }">
            <el-input-number v-model="row.quantity" :min="1"></el-input-number>
          </template>
        </el-table-column>
        <el-table-column label="Técnico Responsável">
          <template #default="{ row }">
            <el-input v-model="row.technician" placeholder="Técnico"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="Motivo">
          <template #default="{ row }">
            <el-input v-model="row.reason" placeholder="Motivo (opcional)"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="Ações" width="100">
          <template #default="{ $index }">
            <el-button type="danger" icon="el-icon-delete" @click="removeEntry($index)"></el-button>
          </template>
        </el-table-column>
      </el-table>
  
      <div class="text-right mt-4">
        <el-button type="success" @click="submitEntries">Registrar Entradas</el-button>
      </div>
    </div>
  </template>
  
  <script>
  import ApiService from '../services/ApiService'
  
  export default {
    name: 'BulkEntryForm',
    data() {
      return {
        toners: [],
        entries: [
          { toner_id: null, quantity: 1, technician: '', reason: '' }
        ],
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
      addEntry() {
        this.entries.push({ toner_id: null, quantity: 1, technician: '', reason: '' })
      },
      removeEntry(index) {
        this.entries.splice(index, 1)
      },
      submitEntries() {
        for (const entry of this.entries) {
          if (!entry.toner_id || !entry.technician || entry.quantity <= 0) {
            this.$message.error('Preencha todos os campos obrigatórios em cada linha.')
            return
          }
        }
  
        ApiService.bulkCreateEntrada(this.entries)
          .then(() => {
            this.$message.success('Entradas registradas com sucesso!')
            this.entries = [{ toner_id: null, quantity: 1, technician: '', reason: '' }]
          })
          .catch(error => {
            this.$message.error(error.response?.data?.message || 'Erro ao registrar entradas múltiplas.')
          })
      }
    }
  }
  </script>
  
  <style scoped>
  </style>
  