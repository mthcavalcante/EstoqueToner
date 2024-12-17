<!-- TonerForm.vue -->
<template>
  <div class="max-w-2xl mx-auto bg-white shadow-md rounded my-6 p-6">
    <h2 class="text-2xl font-semibold mb-4">{{ isEdit ? 'Editar Toner' : 'Adicionar Toner' }}</h2>
    <el-form @submit.prevent="saveToner" label-width="150px">
      <el-form-item label="Nome do Toner" :rules="[{ required: true, message: 'Por favor, insira o nome do toner', trigger: 'blur' }]">
        <el-input v-model="toner.name" placeholder="Nome do Toner"></el-input>
      </el-form-item>
      <el-form-item label="Marca/Modelo Compatível" :rules="[{ required: true, message: 'Por favor, insira a marca/modelo compatível', trigger: 'blur' }]">
        <el-input v-model="toner.compatible" placeholder="Marca/Modelo Compatível"></el-input>
      </el-form-item>
      <el-form-item label="Código" :rules="[{ required: true, message: 'Por favor, insira o código', trigger: 'blur' }]">
        <el-input v-model="toner.code" placeholder="Código"></el-input>
      </el-form-item>
      <el-form-item label="Nível Mínimo de Estoque" :rules="[{ required: true, message: 'Por favor, insira o nível mínimo', trigger: 'blur' }]">
        <el-input-number v-model="toner.min_level" :min="0" label="Nível Mínimo"></el-input-number>
      </el-form-item>
      <el-form-item label="Estoque Atual" :rules="[{ required: true, message: 'Por favor, insira o estoque atual', trigger: 'blur' }]">
        <el-input-number v-model="toner.current_stock" :min="0" label="Estoque Atual"></el-input-number>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveToner">{{ isEdit ? 'Atualizar' : 'Adicionar' }}</el-button>
        <router-link to="/toners">
          <el-button>Cancelar</el-button>
        </router-link>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import ApiService from '../services/ApiService'

export default {
  name: 'TonerForm',
  props: ['id'],
  data() {
    return {
      toner: {
        id: null,
        name: '',
        compatible: '',
        code: '',
        min_level: 0,
        current_stock: 0,
      },
      isEdit: false,
    }
  },
  created() {
    if (this.id) {
      this.isEdit = true
      this.getToner(this.id)
    }
  },
  methods: {
    getToner(id) {
      ApiService.getToner(id)
        .then(response => {
          this.toner = response.data
        })
        .catch(() => {
          this.$message.error('Erro ao carregar o toner.')
        })
    },
    saveToner() {
      if (this.isEdit) {
        ApiService.updateToner(this.toner.id, this.toner)
          .then(() => {
            this.$message.success('Toner atualizado com sucesso!')
            this.$router.push('/toners')
          })
          .catch(() => {
            this.$message.error('Erro ao atualizar o toner.')
          })
      } else {
        ApiService.createToner(this.toner)
          .then(() => {
            this.$message.success('Toner adicionado com sucesso!')
            this.$router.push('/toners')
          })
          .catch(() => {
            this.$message.error('Erro ao adicionar o toner.')
          })
      }
    },
  },
}
</script>

<style scoped>
</style>
