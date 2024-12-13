<!-- src/components/StockMovement.vue -->
<template>
  <div class="bg-white shadow-md rounded my-6 p-6">
    <h2 class="text-2xl font-semibold mb-4">Movimentação de Estoque</h2>
    <el-form @submit.prevent="recordMovement" label-width="200px">
      <!-- Tipo de Movimentação -->
      <el-form-item
        label="Tipo de Movimentação"
        :rules="[{ required: true, message: 'Por favor, selecione o tipo de movimentação', trigger: 'change' }]"
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

      <!-- Técnico Responsável -->
      <el-form-item
        v-if="movement.type"
        :label="movement.type === 'entrada' ? 'Técnico Responsável pela Entrada' : 'Técnico Responsável pela Saída'"
        :rules="[{ required: true, message: `Por favor, insira o técnico responsável pela ${movement.type}`, trigger: 'blur' }]"
      >
        <el-input
          v-model="movement.technician"
          :placeholder="`Técnico Responsável pela ${capitalize(movement.type)}`"
        ></el-input>
      </el-form-item>

      <!-- Toner -->
      <el-form-item
        v-if="movement.type"
        label="Toner"
        :rules="[{ required: true, message: 'Por favor, selecione um toner', trigger: 'change' }]"
      >
        <el-select v-model="movement.tonerId" placeholder="Selecione um toner" clearable>
          <el-option
            v-for="toner in toners"
            :key="toner.id"
            :label="toner.name"
            :value="toner.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <!-- Quantidade -->
      <el-form-item
        v-if="movement.type"
        label="Quantidade"
        :rules="[{ required: true, message: 'Por favor, insira a quantidade', trigger: 'blur' }]"
      >
        <el-input-number v-model="movement.quantity" :min="1" label="Quantidade"></el-input-number>
      </el-form-item>

      <!-- Motivo -->
      <el-form-item
        v-if="movement.type"
        label="Motivo"
        :rules="[{ required: true, message: 'Por favor, insira o motivo', trigger: 'blur' }]"
      >
        <el-input v-model="movement.reason" placeholder="Motivo da movimentação"></el-input>
      </el-form-item>

      <!-- Nome da Pessoa que Pegou e Impressora (Somente para Saída) -->
      <div v-if="movement.type === 'saida'">
        <el-form-item
          label="Nome da Pessoa"
          :rules="[{ required: true, message: 'Por favor, insira o nome da pessoa que pegou o toner', trigger: 'blur' }]"
        >
          <el-input v-model="movement.personName" placeholder="Nome da Pessoa"></el-input>
        </el-form-item>

        <el-form-item
          label="Impressora"
          :rules="[{ required: true, message: 'Por favor, insira a impressora', trigger: 'blur' }]"
        >
          <el-input v-model="movement.printer" placeholder="Nome da Impressora"></el-input>
        </el-form-item>
      </div>

      <!-- Botões de Ação -->
      <el-form-item>
        <el-button type="primary" @click="recordMovement">Registrar Movimentação</el-button>
        <el-button type="default" @click="resetForm">Limpar</el-button>
      </el-form-item>
    </el-form>

    <!-- Histórico de Movimentações -->
    <h3 class="text-xl font-semibold mb-4">Histórico de Movimentações</h3>
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
          {{ getTonerName(row.tonerId) }}
        </template>
      </el-table-column>
      
      <el-table-column prop="quantity" label="Quantidade" width="100"></el-table-column>
      <el-table-column prop="reason" label="Motivo"></el-table-column>
      <el-table-column prop="technician" label="Técnico Responsável"></el-table-column>
      
      <el-table-column
        prop="personName"
        label="Pessoa que Pegou"
        width="150"
      >
        <template #default="{ row }">
          <span v-if="row.type === 'saida'">{{ row.personName }}</span>
          <span v-else>—</span>
        </template>
      </el-table-column>
      
      <el-table-column
        prop="printer"
        label="Impressora"
        width="150"
      >
        <template #default="{ row }">
          <span v-if="row.type === 'saida'">{{ row.printer }}</span>
          <span v-else>—</span>
        </template>
      </el-table-column>
      
      <el-table-column prop="date" label="Data"></el-table-column>
    </el-table>
    <div v-if="filteredMovements.length === 0" class="text-center mt-4">
      Nenhuma movimentação encontrada.
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
        type: '',
        technician: '',
        tonerId: null,
        quantity: 1,
        reason: '',
        personName: '', // Para Saída
        printer: '',    // Para Saída
        // user: '', // Removido conforme solicitado
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
    this.loadData()
  },
  methods: {
    loadData() {
      this.toners = StorageService.getData('toners')
      this.movements = StorageService.getData('movements') || []
    },
    getTonerName(id) {
      const toner = this.toners.find(t => t.id === id)
      return toner ? toner.name : 'Desconhecido'
    },
    recordMovement() {
      // Validação de movimentação
      if (this.movement.type === 'saida') {
        const toner = this.toners.find(t => t.id === this.movement.tonerId)
        if (toner) {
          if (toner.currentStock < this.movement.quantity) {
            this.$message.error('Estoque insuficiente para esta movimentação.')
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

      // Exibir mensagem de sucesso
      this.$message({
        type: 'success',
        message: 'Movimentação registrada com sucesso!'
      })

      // Resetar formulário
      this.resetForm()
    },
    resetForm() {
      this.movement = {
        id: null,
        type: '',
        technician: '',
        tonerId: null,
        quantity: 1,
        reason: '',
        personName: '',
        printer: '',
        date: '',
      }
    },
    handleTypeChange(selectedType) {
      // Resetar campos específicos ao mudar o tipo
      if (selectedType === 'entrada') {
        this.movement.personName = ''
        this.movement.printer = ''
      }
      if (selectedType === 'saida') {
        // Nenhuma ação específica, mas pode adicionar lógicas adicionais se necessário
      }
    },
    capitalize(word) {
      if (!word) return ''
      return word.charAt(0).toUpperCase() + word.slice(1)
    }
  },
}
</script>

<style scoped>
/* Estilos adicionais, se necessário */
</style>
