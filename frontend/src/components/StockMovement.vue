<!-- StockMovement.vue -->
<template>
  <div class="bg-white shadow-md rounded my-6 p-6">
    <h2 class="text-2xl font-semibold mb-4">Movimentação de Estoque</h2>
    <el-form @submit.prevent="recordMovement" label-width="200px">
      <el-form-item
        label="Tipo de Movimentação"
        :rules="[{ required: true, message: 'Selecione o tipo de movimentação', trigger: 'change' }]"
      >
        <el-select v-model="movement.type" placeholder="Selecione o tipo" clearable @change="handleTypeChange">
          <el-option
            v-for="type in movementTypes"
            :key="type"
            :label="capitalize(type)"
            :value="type"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item
        v-if="movement.type"
        :label="movement.type === 'entrada' ? 'Técnico Responsável pela Entrada' : 'Técnico Responsável pela Saída'"
        :rules="[{ required: true, message: `Insira o técnico responsável pela ${movement.type}`, trigger: 'blur' }]"
      >
        <el-input v-model="movement.technician" :placeholder="`Técnico Responsável pela ${capitalize(movement.type)}`"></el-input>
      </el-form-item>

      <el-form-item
        v-if="movement.type"
        label="Toner"
        :rules="[{ required: true, message: 'Selecione um toner', trigger: 'change' }]"
      >
        <el-select v-model="movement.toner_id" placeholder="Selecione um toner" clearable>
          <el-option
            v-for="toner in toners"
            :key="toner.id"
            :label="toner.name"
            :value="toner.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item
        v-if="movement.type"
        label="Quantidade"
        :rules="[{ required: true, message: 'Insira a quantidade', trigger: 'blur' }]"
      >
        <el-input-number v-model="movement.quantity" :min="1" label="Quantidade"></el-input-number>
      </el-form-item>

      <el-form-item
        v-if="movement.type"
        label="Motivo"
        :rules="[{ required: true, message: 'Insira o motivo', trigger: 'blur' }]"
      >
        <el-input v-model="movement.reason" placeholder="Motivo da movimentação"></el-input>
      </el-form-item>

      <div v-if="movement.type === 'saida'">
        <el-form-item
          label="Nome da Pessoa"
          :rules="[{ required: true, message: 'Insira o nome da pessoa que pegou o toner', trigger: 'blur' }]"
        >
          <el-input v-model="movement.person_name" placeholder="Nome da Pessoa"></el-input>
        </el-form-item>

        <el-form-item
          label="Impressora"
          :rules="[{ required: true, message: 'Insira a impressora', trigger: 'blur' }]"
        >
          <el-input v-model="movement.printer" placeholder="Nome da Impressora"></el-input>
        </el-form-item>
      </div>

      <el-form-item>
        <el-button type="primary" @click="recordMovement">Registrar Movimentação</el-button>
        <el-button type="default" @click="resetForm">Limpar</el-button>
      </el-form-item>
    </el-form>

    <!-- Histórico de Movimentações -->
    <h3 class="text-xl font-semibold mb-4 mt-8">Histórico de Movimentações</h3>
    <el-input
      v-model="search"
      placeholder="Pesquisar movimentações..."
      prefix-icon="el-icon-search"
      clearable
      class="mb-4"
    ></el-input>
    <el-table
      :data="filteredMovements"
      style="width: 100%"
      border
      stripe
    >
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
          <span v-if="row.type === 'saida'">{{ row.printer }}</span>
          <span v-else>—</span>
        </template>
      </el-table-column>
      
      <!-- Ajuste a prop da data conforme o backend. Supondo 'created_at': -->
      <el-table-column prop="created_at" label="Data de Criação" width="180">
            <template #default="{ row }">
              {{ formatDate(row.created_at || row.createdAt || row.date) }}
            </template>
          </el-table-column>
    </el-table>
    <div v-if="filteredMovements.length === 0" class="text-center mt-4">
      Nenhuma movimentação encontrada.
    </div>
  </div>
</template>

<script>
import ApiService from '../services/ApiService'
import dayjs from 'dayjs'

export default {
  name: 'StockMovement',
  data() {
    return {
      toners: [],
      movements: [],
      movement: {
        id: null,
        type: '',
        technician: '',
        toner_id: null,
        quantity: 1,
        reason: '',
        person_name: '',
        printer: '',
        // Removendo 'date' pois usaremos 'created_at' do backend
      },
      movementTypes: ['entrada', 'saida'],
      search: '',
    }
  },
  computed: {
    filteredMovements() {
      if (!this.search) return this.movements
      const searchTerm = this.search.toLowerCase()
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
    recordMovement() {
      const movementData = { ...this.movement }

      ApiService.createMovement(movementData)
        .then(() => {
          this.$message.success('Movimentação registrada com sucesso!')
          this.loadMovements()
          this.resetForm()
        })
        .catch(error => {
          this.$message.error(error.response?.data?.message || 'Erro ao registrar a movimentação.')
        })
    },
    resetForm() {
      this.movement = {
        id: null,
        type: '',
        technician: '',
        toner_id: null,
        quantity: 1,
        reason: '',
        person_name: '',
        printer: '',
      }
    },
    handleTypeChange(selectedType) {
      if (selectedType === 'entrada') {
        this.movement.person_name = ''
        this.movement.printer = ''
      }
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
