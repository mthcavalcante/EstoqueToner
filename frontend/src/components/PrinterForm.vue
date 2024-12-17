<!-- PrinterForm.vue -->
<template>
  <div class="max-w-2xl mx-auto bg-white shadow-md rounded my-6 p-6">
    <h2 class="text-2xl font-semibold mb-4">{{ isEdit ? 'Editar Impressora' : 'Adicionar Impressora' }}</h2>
    <el-form @submit.prevent="savePrinter" label-width="150px">
      <el-form-item 
        label="Nome da Impressora" 
        :rules="[{ required: true, message: 'Por favor, insira o nome da impressora', trigger: 'blur' }]">
        <el-input v-model="printer.name" placeholder="Nome da Impressora"></el-input>
      </el-form-item>
      <el-form-item label="Localização">
        <el-input v-model="printer.location" placeholder="Localização (opcional)"></el-input>
      </el-form-item>

      <el-form-item label="Toners Compatíveis">
        <el-select v-model="selectedToners" placeholder="Selecione os toners compatíveis" multiple clearable>
          <el-option
            v-for="toner in allToners"
            :key="toner.id"
            :label="toner.name"
            :value="toner.id">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="savePrinter">{{ isEdit ? 'Atualizar' : 'Adicionar' }}</el-button>
        <router-link to="/printers">
          <el-button>Cancelar</el-button>
        </router-link>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import ApiService from '../services/ApiService'

export default {
  name: 'PrinterForm',
  props: ['id'],
  data() {
    return {
      printer: {
        id: null,
        name: '',
        location: '',
      },
      isEdit: false,
      allToners: [],
      selectedToners: [], // Array de IDs de toners selecionados
      originalAssociatedToners: [] // Toners já associados na carga inicial (usado no modo edit)
    }
  },
  created() {
    this.loadToners()
    const printerId = this.id || this.$route.params.id;
    if (printerId) {
      this.isEdit = true
      this.getPrinter(printerId)
      this.getCompatibleToners(printerId)
    }
  },
  methods: {
    loadToners() {
      ApiService.getToners()
        .then(response => {
          this.allToners = response.data
        })
        .catch(() => {
          this.$message.error('Erro ao carregar toners.')
        })
    },
    getPrinter(id) {
      ApiService.getPrinter(id)
        .then(response => {
          this.printer = response.data
        })
        .catch(() => {
          this.$message.error('Erro ao carregar a impressora.')
        })
    },
    getCompatibleToners(printerId) {
      ApiService.getCompatibleTonersForPrinter(printerId)
        .then(response => {
          this.originalAssociatedToners = response.data.map(t => t.id)
          this.selectedToners = [...this.originalAssociatedToners]
        })
        .catch(() => {
          this.$message.error('Erro ao carregar toners compatíveis desta impressora.')
        })
    },
    async savePrinter() {
      if (this.isEdit) {
        // Atualizar impressora
        ApiService.updatePrinter(this.printer.id, this.printer)
          .then(() => {
            this.$message.success('Impressora atualizada com sucesso!')
            this.updateTonerAssociations()
          })
          .catch(() => {
            this.$message.error('Erro ao atualizar a impressora.')
          })
      } else {
        // Criar nova impressora
        ApiService.createPrinter(this.printer)
          .then(response => {
            this.printer = response.data
            this.$message.success('Impressora adicionada com sucesso!')
            this.updateTonerAssociations()
          })
          .catch(() => {
            this.$message.error('Erro ao adicionar a impressora.')
          })
      }
    },
    async updateTonerAssociations() {
      // Atualizar associações entre impressora e toners
      const printerId = this.printer.id;
      if (!printerId) {
        this.$router.push('/printers')
        return;
      }

      let associatedToners = [];
      try {
        const resp = await ApiService.getCompatibleTonersForPrinter(printerId);
        associatedToners = resp.data.map(t => t.id);
      } catch {
        this.$message.error('Erro ao obter toners compatíveis atuais da impressora.');
        // Mesmo assim, tentaremos prosseguir
      }

      // Toners a remover
      const toRemove = associatedToners.filter(id => !this.selectedToners.includes(id));
      // Toners a adicionar
      const toAdd = this.selectedToners.filter(id => !associatedToners.includes(id));

      // Remover associações
      for (const tonerId of toRemove) {
        try {
          await ApiService.removePrinterFromToner(tonerId, printerId);
        } catch {
          this.$message.error(`Erro ao remover associação do toner ${tonerId}.`);
        }
      }

      // Adicionar novas associações
      for (const tonerId of toAdd) {
        try {
          await ApiService.addPrinterToToner(tonerId, printerId);
        } catch {
          this.$message.error(`Erro ao associar toner ${tonerId} à impressora.`);
        }
      }

      this.$router.push('/printers')
    }
  }
}
</script>

<style scoped>
</style>
