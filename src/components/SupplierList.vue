<!-- src/components/SupplierList.vue -->
<template>
    <div>
      <h2>Lista de Fornecedores</h2>
      <router-link to="/suppliers/add">Adicionar Novo Fornecedor</router-link>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome da Empresa</th>
            <th>Contato</th>
            <th>WhatsApp</th>
            <th>Endereço</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="supplier in suppliers" :key="supplier.id">
            <td>{{ supplier.id }}</td>
            <td>{{ supplier.companyName }}</td>
            <td>{{ supplier.contact }}</td>
            <td>{{ supplier.whatsapp }}</td>
            <td>{{ supplier.address }}</td>
            <td>
              <router-link :to="`/suppliers/edit/${supplier.id}`">Editar</router-link>
              <button @click="deleteSupplier(supplier.id)">Excluir</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script>
  import StorageService from '../services/StorageService';
  
  export default {
    name: 'SupplierList',
    data() {
      return {
        suppliers: [],
      };
    },
    created() {
      this.loadSuppliers();
    },
    methods: {
      loadSuppliers() {
        this.suppliers = StorageService.getData('suppliers');
      },
      deleteSupplier(id) {
        if (confirm('Tem certeza que deseja excluir este fornecedor?')) {
          this.suppliers = this.suppliers.filter(supplier => supplier.id !== id);
          StorageService.setData('suppliers', this.suppliers);
        }
      },
    },
  };
  </script>
  
  <style scoped>
  table {
    width: 100%;
    border-collapse: collapse;
  }
  th, td {
    padding: 8px;
    border: 1px solid #ccc;
  }
  button {
    margin-left: 5px;
  }
  </style>
  