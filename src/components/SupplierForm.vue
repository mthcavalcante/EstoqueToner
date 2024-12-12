<!-- src/components/SupplierForm.vue -->
<template>
    <div>
      <h2>{{ isEdit ? 'Editar Fornecedor' : 'Adicionar Fornecedor' }}</h2>
      <form @submit.prevent="saveSupplier">
        <div>
          <label for="companyName">Nome da Empresa:</label>
          <input type="text" v-model="supplier.companyName" required />
        </div>
        <div>
          <label for="contact">Contato Responsável:</label>
          <input type="text" v-model="supplier.contact" required />
        </div>
        <div>
          <label for="whatsapp">Número de WhatsApp:</label>
          <input type="text" v-model="supplier.whatsapp" required />
        </div>
        <div>
          <label for="address">Endereço:</label>
          <input type="text" v-model="supplier.address" required />
        </div>
        <button type="submit">{{ isEdit ? 'Atualizar' : 'Adicionar' }}</button>
        <router-link to="/suppliers">Cancelar</router-link>
      </form>
    </div>
  </template>
  
  <script>
  import StorageService from '../services/StorageService';
  
  export default {
    name: 'SupplierForm',
    props: ['id'],
    data() {
      return {
        suppliers: [],
        supplier: {
          id: null,
          companyName: '',
          contact: '',
          whatsapp: '',
          address: '',
        },
        isEdit: false,
      };
    },
    created() {
      this.suppliers = StorageService.getData('suppliers');
      if (this.id) {
        const existingSupplier = this.suppliers.find(s => s.id === parseInt(this.id));
        if (existingSupplier) {
          this.supplier = { ...existingSupplier };
          this.isEdit = true;
        }
      }
    },
    methods: {
      saveSupplier() {
        if (this.isEdit) {
          const index = this.suppliers.findIndex(s => s.id === this.supplier.id);
          if (index !== -1) {
            this.suppliers.splice(index, 1, this.supplier);
          }
        } else {
          this.supplier.id = StorageService.generateId(this.suppliers);
          this.suppliers.push(this.supplier);
        }
        StorageService.setData('suppliers', this.suppliers);
        this.$router.push('/suppliers');
      },
    },
  };
  </script>
  
  <style scoped>
  form div {
    margin-bottom: 10px;
  }
  label {
    display: inline-block;
    width: 200px;
  }
  input {
    padding: 5px;
    width: 300px;
  }
  button {
    margin-right: 10px;
  }
  </style>
  