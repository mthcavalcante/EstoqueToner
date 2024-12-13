<!-- src/components/TonerList.vue -->
<template>
  <div class="bg-white shadow-md rounded my-6 p-6">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-2xl font-semibold">Lista de Toners</h2>
      <el-button type="primary" @click="navigateToAdd">Adicionar Novo Toner</el-button>
    </div>
    <el-input
      v-model="search"
      placeholder="Pesquisar toners..."
      class="mb-4"
      prefix-icon="el-icon-search"
      clearable
    ></el-input>
    <el-table
      :data="filteredToners"
      style="width: 100%"
      border
      stripe
    >
      <el-table-column prop="id" label="ID" width="80">
      </el-table-column>
      <el-table-column prop="name" label="Nome do Toner">
      </el-table-column>
      <el-table-column prop="compatible" label="Marca/Modelo Compatível">
      </el-table-column>
      <el-table-column prop="code" label="Código">
      </el-table-column>
      <el-table-column prop="minLevel" label="Nível Mínimo">
      </el-table-column>
      <el-table-column prop="currentStock" label="Estoque Atual">
      </el-table-column>
      <el-table-column label="Ações" width="180">
        <template #default="scope">
          <el-button size="mini" type="info" @click="navigateToEdit(scope.row.id)">Editar</el-button>
          <el-button size="mini" type="danger" @click="deleteToner(scope.row.id)">Excluir</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-if="filteredToners.length === 0" class="text-center mt-4">
      Nenhum toner encontrado.
    </div>
  </div>
</template>

<script>
import StorageService from '../services/StorageService'

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
      return this.toners.filter(toner =>
        toner.name.toLowerCase().includes(this.search.toLowerCase())
      )
    }
  },
  created() {
    this.loadToners()
  },
  methods: {
    loadToners() {
      this.toners = StorageService.getData('toners')
    },
    navigateToAdd() {
      this.$router.push('/toners/add')
    },
    navigateToEdit(id) {
      this.$router.push(`/toners/edit/${id}`)
    },
    deleteToner(id) {
      this.$confirm('Tem certeza que deseja excluir este toner?', 'Confirmação', {
        confirmButtonText: 'Sim',
        cancelButtonText: 'Não',
        type: 'warning',
      }).then(() => {
        this.toners = this.toners.filter(toner => toner.id !== id)
        StorageService.setData('toners', this.toners)
        this.$message({
          type: 'success',
          message: 'Toner excluído com sucesso!'
        })
      }).catch(() => {
        // Ação cancelada
      })
    },
  },
}
</script>

<style scoped>
.headline {
  font-weight: bold;
}
</style>
