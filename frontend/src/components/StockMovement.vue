<!-- src/components/StockMovement.vue -->
<template>
  <div class="bg-white shadow-md rounded my-6 p-6">
    <h2 class="text-2xl font-semibold mb-4">Movimentação de Estoque</h2>
    <el-form @submit.prevent="handleSubmit" label-width="200px">

      <!-- Tipo da Movimentação -->
      <el-form-item
        label="Tipo de Movimentação"
        :rules="[{ required: true, message: 'Selecione o tipo de movimentação', trigger: 'change' }]"
      >
        <el-select
          v-model="movement.type"
          placeholder="Selecione o tipo"
          clearable
          @change="handleTypeChange"
        >
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
        :rules="[{ required: true, message: `Insira o técnico responsável pela ${capitalize(movement.type)}`, trigger: 'blur' }]"
      >
        <el-input
          v-model="movement.technician"
          :placeholder="`Técnico Responsável pela ${capitalize(movement.type)}`"
        ></el-input>
      </el-form-item>

      <!-- Se for Saída: Selecionar Impressora -->
      <el-form-item
        v-if="movement.type === 'saida'"
        label="Impressora"
        :rules="[{ required: true, message: 'Selecione uma impressora', trigger: 'change' }]"
      >
        <el-select
          v-model="selectedPrinterId"
          placeholder="Selecione uma impressora"
          clearable
          @change="handlePrinterChange"
        >
          <el-option
            v-for="printer in allPrinters"
            :key="printer.id"
            :label="printer.name"
            :value="printer.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <!-- Se for Saída e Impressora Selecionada: Tabela de Saídas Múltiplas -->
      <div
        v-if="movement.type === 'saida' && selectedPrinterId && compatibleToners.length > 0"
      >
        <el-button
          type="primary"
          class="mb-4"
          @click="addSaidaEntry"
        >
          Adicionar Toner
        </el-button>

        <el-table
          :data="saidaEntries"
          style="width:100%"
          border
          stripe
        >
          <el-table-column label="Toner">
            <template #default="{ row }">
              <el-select
                v-model="row.toner_id"
                placeholder="Selecione um toner"
                @change="validateTonerSelection(row)"
              >
                <el-option
                  v-for="toner in compatibleToners"
                  :key="toner.id"
                  :label="toner.name"
                  :value="toner.id"
                ></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="Quantidade" width="100">
            <template #default="{ row }">
              <el-input-number
                v-model="row.quantity"
                :min="1"
              ></el-input-number>
            </template>
          </el-table-column>
          <el-table-column label="Motivo">
            <template #default="{ row }">
              <el-input
                v-model="row.reason"
                placeholder="Motivo (opcional)"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column label="Ações" width="100">
            <template #default="{ $index }">
              <el-button
                type="danger"
                icon="el-icon-delete"
                @click="removeSaidaEntry($index)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- Campos Adicionais para Saída -->
      <div v-if="movement.type === 'saida' && selectedPrinterId">
        <el-form-item
          label="Nome da Pessoa"
          :rules="[{ required: true, message: 'Insira o nome da pessoa que pegou o toner', trigger: 'blur' }]"
        >
          <el-input
            v-model="movement.person_name"
            placeholder="Nome da Pessoa"
          ></el-input>
        </el-form-item>
      </div>

      <!-- Campos para Entrada -->
      <div v-else-if="movement.type === 'entrada'">
        <el-form-item
          label="Toner"
          :rules="[{ required: true, message: 'Selecione um toner', trigger: 'change' }]"
        >
          <el-select
            v-model="movement.toner_id"
            placeholder="Selecione um toner"
            clearable
          >
            <el-option
              v-for="toner in toners"
              :key="toner.id"
              :label="toner.name"
              :value="toner.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          label="Quantidade"
          :rules="[{ required: true, message: 'Insira a quantidade', trigger: 'blur' }]"
        >
          <el-input-number
            v-model="movement.quantity"
            :min="1"
            label="Quantidade"
          ></el-input-number>
        </el-form-item>

        <el-form-item
          label="Motivo"
          :rules="[{ required: true, message: 'Insira o motivo', trigger: 'blur' }]"
        >
          <el-input
            v-model="movement.reason"
            placeholder="Motivo da movimentação"
          ></el-input>
        </el-form-item>
      </div>

      <!-- Botões de Ação -->
      <el-form-item>
        <el-button type="primary" @click="handleSubmit">Registrar Movimentação</el-button>
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
      <el-table-column label="Impressora" width="150">
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
</template>

<script>
import ApiService from '../services/ApiService'
import dayjs from 'dayjs'

export default {
  name: 'StockMovement',
  data() {
    return {
      toners: [],
      allPrinters: [],
      movements: [],
      movement: {
        id: null,
        type: '',
        technician: '',
        toner_id: null,
        quantity: 1,
        reason: '',
        person_name: '',
        printer_id: null,
      },
      movementTypes: ['entrada', 'saida'],
      search: '',
      // Variáveis para Saída Múltipla
      selectedPrinterId: null,
      compatibleToners: [],
      saidaEntries: [],
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
    // Carrega todos os dados necessários
    loadData() {
      this.loadToners()
      this.loadMovements()
      this.loadPrinters()
    },
    // Carrega os toners
    loadToners() {
      ApiService.getToners()
        .then(response => {
          this.toners = response.data
        })
        .catch(() => {
          this.$message.error('Erro ao carregar toners.')
        })
    },
    // Carrega as movimentações
    loadMovements() {
      ApiService.getMovements()
        .then(response => {
          this.movements = response.data
        })
        .catch(() => {
          this.$message.error('Erro ao carregar movimentações.')
        })
    },
    // Carrega as impressoras
    loadPrinters() {
      ApiService.getPrinters()
        .then(response => {
          this.allPrinters = response.data
        })
        .catch(() => {
          this.$message.error('Erro ao carregar impressoras.')
        })
    },
    // Obtém o nome do toner pelo ID
    getTonerName(id) {
      const toner = this.toners.find(t => t.id === id)
      return toner ? toner.name : 'Desconhecido'
    },
    // Registra uma movimentação de entrada
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
    // Reseta o formulário
    resetForm() {
      this.movement = {
        id: null,
        type: '',
        technician: '',
        toner_id: null,
        quantity: 1,
        reason: '',
        person_name: '',
        printer_id: null,
      }
      this.selectedPrinterId = null
      this.compatibleToners = []
      this.saidaEntries = []
    },
    // Manipula a mudança do tipo de movimentação
    handleTypeChange(selectedType) {
      if (selectedType === 'entrada') {
        this.movement.person_name = ''
        this.movement.printer_id = null
        this.selectedPrinterId = null
        this.compatibleToners = []
        this.saidaEntries = []
      } else if (selectedType === 'saida') {
        // Resetar entradas de saída quando o tipo muda para 'saida'
        this.saidaEntries = []
      }
    },
    // Adiciona uma nova entrada de saída
    addSaidaEntry() {
      this.saidaEntries.push({ toner_id: null, quantity: 1, reason: '' })
    },
    // Remove uma entrada de saída
    removeSaidaEntry(index) {
      this.saidaEntries.splice(index, 1)
    },
    // Carrega toners compatíveis com a impressora selecionada
    handlePrinterChange(printerId) {
      if (!printerId) {
        this.compatibleToners = []
        this.saidaEntries = []
        return
      }
      ApiService.getCompatibleTonersForPrinter(printerId)
        .then(response => {
          this.compatibleToners = response.data
          // Resetar as entradas de saída quando os toners compatíveis mudam
          this.saidaEntries = []
        })
        .catch(() => {
          this.$message.error('Erro ao carregar toners compatíveis com esta impressora.')
          this.compatibleToners = []
          this.saidaEntries = []
        })
    },
    // Submete as movimentações de saída múltiplas
    submitSaidaMovements() {
      // Validação das entradas de saída
      for (const [index, entry] of this.saidaEntries.entries()) {
        if (!entry.toner_id) {
          this.$message.error(`Selecione um toner para a entrada ${index + 1}.`)
          return
        }
        if (entry.quantity <= 0) {
          this.$message.error(`Insira uma quantidade válida para a entrada ${index + 1}.`)
          return
        }
      }

      // Monta o array de movimentações de saída
      const saidaArray = this.saidaEntries.map(entry => ({
        toner_id: entry.toner_id,
        quantity: entry.quantity,
        technician: this.movement.technician,
        reason: entry.reason,
        printer_id: this.selectedPrinterId,
      }))

      // Envia para o backend usando bulkCreateSaida
      ApiService.bulkCreateSaida(saidaArray)
        .then(() => {
          this.$message.success('Saída(s) registrada(s) com sucesso!')
          this.loadMovements()
          this.resetForm()
        })
        .catch(error => {
          this.$message.error(error.response?.data?.message || 'Erro ao registrar saída(s).')
        })
    },
    // Função de submit para o formulário
    handleSubmit() {
      if (this.movement.type === 'entrada') {
        this.recordMovement()
      } else if (this.movement.type === 'saida') {
        if (this.saidaEntries.length === 0) {
          this.$message.error('Adicione pelo menos uma entrada de saída.')
          return
        }
        this.submitSaidaMovements()
      }
    },
    // Função utilitária para capitalizar strings
    capitalize(word) {
      if (!word) return ''
      return word.charAt(0).toUpperCase() + word.slice(1)
    },
    // Formata datas (se necessário no template)
    formatDate(dateStr) {
      if (!dateStr) return 'Data não disponível'
      const date = dayjs(dateStr)
      return date.isValid() ? date.format('DD/MM/YYYY HH:mm') : 'Data inválida'
    },
    // Função de validação ao selecionar um toner
    validateTonerSelection(row) {
      if (!row.toner_id) return

      // Obter os dados do toner selecionado
      ApiService.getToner(row.toner_id)
        .then(response => {
          const toner = response.data
          // Verificar se a quantidade solicitada está disponível no estoque
          if (toner.stock < row.quantity) {
            this.$message.error(`Quantidade solicitada para o toner "${toner.name}" excede o estoque disponível (${toner.stock}).`)
            // Opcional: Ajustar a quantidade para o máximo disponível
            row.quantity = toner.stock
          }
        })
        .catch(() => {
          this.$message.error('Erro ao verificar o estoque do toner selecionado.')
        })
    }
  },
}
</script>

<style scoped>
.stock-movement-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.card-title {
  margin-bottom: 1rem;
}

.form-card, .history-card {
  padding: 1.5rem;
}

.add-toner-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.saida-table {
  margin-top: 1rem;
}

.text-right {
  text-align: right;
}

.action-buttons {
  display: flex;
  gap: 1rem;
}

.search-input {
  width: 100%;
}

.no-data {
  text-align: center;
  color: #909399;
  padding: 1rem 0;
}

.additional-fields, .entrada-fields {
  margin-top: 1rem;
}

@media (max-width: 768px) {
  .form-card, .history-card {
    padding: 1rem;
  }

  .el-form-item {
    label-width: 150px;
  }

  .action-buttons {
    flex-direction: column;
  }

  .add-toner-button {
    width: 100%;
    justify-content: center;
  }

  .text-right {
    text-align: center;
  }
}
</style>
