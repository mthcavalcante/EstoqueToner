<!-- src/components/Reports.vue -->
<template>
    <div>
      <h2>Relatórios de Estoque</h2>
      <h3>Estoque Atual</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome do Toner</th>
            <th>Estoque Atual</th>
            <th>Nível Mínimo</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="toner in toners" :key="toner.id">
            <td>{{ toner.id }}</td>
            <td>{{ toner.name }}</td>
            <td>{{ toner.currentStock }}</td>
            <td>{{ toner.minLevel }}</td>
          </tr>
        </tbody>
      </table>
  
      <h3>Movimentações Recentes</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Toner</th>
            <th>Tipo</th>
            <th>Quantidade</th>
            <th>Motivo</th>
            <th>Usuário</th>
            <th>Data</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="movement in recentMovements" :key="movement.id">
            <td>{{ movement.id }}</td>
            <td>{{ getTonerName(movement.tonerId) }}</td>
            <td>{{ movement.type }}</td>
            <td>{{ movement.quantity }}</td>
            <td>{{ movement.reason }}</td>
            <td>{{ movement.user }}</td>
            <td>{{ movement.date }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script>
  import StorageService from '../services/StorageService';
  
  export default {
    name: 'StockReports', // Atualizado para multi-word
    data() {
      return {
        toners: [],
        movements: [],
      };
    },
    computed: {
      recentMovements() {
        return this.movements.slice(-10).reverse(); // Últimas 10 movimentações
      },
    },
    created() {
      this.toners = StorageService.getData('toners');
      this.movements = StorageService.getData('movements');
    },
    methods: {
      getTonerName(id) {
        const toner = this.toners.find(t => t.id === id);
        return toner ? toner.name : 'Desconhecido';
      },
    },
  };
  </script>
  
  <style scoped>
  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
  }
  th, td {
    padding: 8px;
    border: 1px solid #ccc;
  }
  </style>
  