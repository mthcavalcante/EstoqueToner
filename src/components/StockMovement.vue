<!-- src/components/StockMovement.vue -->
<template>
    <div>
      <h2>Movimentação de Estoque</h2>
      <form @submit.prevent="recordMovement">
        <div>
          <label for="toner">Toner:</label>
          <select v-model="movement.tonerId" required>
            <option v-for="toner in toners" :key="toner.id" :value="toner.id">
              {{ toner.name }}
            </option>
          </select>
        </div>
        <div>
          <label for="type">Tipo de Movimentação:</label>
          <select v-model="movement.type" required>
            <option value="entrada">Entrada</option>
            <option value="saida">Saída</option>
          </select>
        </div>
        <div>
          <label for="quantity">Quantidade:</label>
          <input type="number" v-model.number="movement.quantity" min="1" required />
        </div>
        <div>
          <label for="reason">Motivo:</label>
          <input type="text" v-model="movement.reason" required />
        </div>
        <div>
          <label for="user">Usuário Responsável:</label>
          <input type="text" v-model="movement.user" required />
        </div>
        <button type="submit">Registrar Movimentação</button>
      </form>
  
      <h3>Histórico de Movimentações</h3>
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
          <tr v-for="movement in movements" :key="movement.id">
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
    name: 'StockMovement',
    data() {
      return {
        toners: [],
        movements: [],
        movement: {
          id: null,
          tonerId: null,
          type: 'entrada',
          quantity: 1,
          reason: '',
          user: '',
          date: '',
        },
      };
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
      recordMovement() {
        this.movement.id = StorageService.generateId(this.movements);
        this.movement.date = new Date().toLocaleString();
        this.movements.push({ ...this.movement });
        StorageService.setData('movements', this.movements);
        this.updateStock();
        // Reset form
        this.movement = {
          id: null,
          tonerId: null,
          type: 'entrada',
          quantity: 1,
          reason: '',
          user: '',
          date: '',
        };
      },
      updateStock() {
        const toners = StorageService.getData('toners');
        const tonerIndex = toners.findIndex(t => t.id === this.movement.tonerId);
        if (tonerIndex !== -1) {
          if (this.movement.type === 'entrada') {
            toners[tonerIndex].currentStock = (toners[tonerIndex].currentStock || 0) + this.movement.quantity;
          } else if (this.movement.type === 'saida') {
            toners[tonerIndex].currentStock = (toners[tonerIndex].currentStock || 0) - this.movement.quantity;
            if (toners[tonerIndex].currentStock < 0) {
              alert('Estoque negativo! Verifique a quantidade.');
              toners[tonerIndex].currentStock += this.movement.quantity; // Reverter
              return;
            }
          }
          StorageService.setData('toners', toners);
        }
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
  input, select {
    padding: 5px;
    width: 300px;
  }
  button {
    margin-top: 10px;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
  }
  th, td {
    padding: 8px;
    border: 1px solid #ccc;
  }
  </style>
  