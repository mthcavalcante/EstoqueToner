<!-- SupplierForm.vue -->
<template>
  <div class="max-w-2xl mx-auto bg-white shadow-md rounded my-6 p-6">
    <h2 class="text-2xl font-semibold mb-4">{{ isEdit ? 'Editar Fornecedor' : 'Adicionar Fornecedor' }}</h2>
    <el-form @submit.prevent="saveSupplier" label-width="150px">
      <el-form-item label="Nome da Empresa" :rules="[{ required: true, message: 'Por favor, insira o nome da empresa', trigger: 'blur' }]">
        <el-input v-model="supplier.company_name" placeholder="Nome da Empresa"></el-input>
      </el-form-item>
      <el-form-item label="Contato Responsável" :rules="[{ required: true, message: 'Por favor, insira o contato', trigger: 'blur' }]">
        <el-input v-model="supplier.contact" placeholder="Contato Responsável"></el-input>
      </el-form-item>
      <el-form-item label="Número de WhatsApp">
        <el-input v-model="supplier.whatsapp" placeholder="Número de WhatsApp"></el-input>
      </el-form-item>
      <el-form-item label="Endereço">
        <el-input v-model="supplier.address" placeholder="Endereço"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveSupplier">{{ isEdit ? 'Atualizar' : 'Adicionar' }}</el-button>
        <router-link to="/suppliers">
          <el-button>Cancelar</el-button>
        </router-link>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import ApiService from '../services/ApiService'

export default {
  name: 'SupplierForm',
  props: ['id'],
  data() {
    return {
      supplier: {
        id: null,
        company_name: '',
        contact: '',
        whatsapp: '',
        address: '',
      },
      isEdit: false,
    }
  },
  created() {
    if (this.id) {
      this.isEdit = true
      this.getSupplier(this.id)
    }
  },
  methods: {
    getSupplier(id) {
      ApiService.getSupplier(id)
        .then(response => {
          this.supplier = response.data
        })
        .catch(() => {
          this.$message.error('Erro ao carregar o fornecedor.')
        })
    },
    saveSupplier() {
      if (this.isEdit) {
        ApiService.updateSupplier(this.supplier.id, this.supplier)
          .then(() => {
            this.$message.success('Fornecedor atualizado com sucesso!')
            this.$router.push('/suppliers')
          })
          .catch(() => {
            this.$message.error('Erro ao atualizar o fornecedor.')
          })
      } else {
        ApiService.createSupplier(this.supplier)
          .then(() => {
            this.$message.success('Fornecedor adicionado com sucesso!')
            this.$router.push('/suppliers')
          })
          .catch(() => {
            this.$message.error('Erro ao adicionar o fornecedor.')
          })
      }
    },
  },
}
</script>

<style scoped>
</style>
