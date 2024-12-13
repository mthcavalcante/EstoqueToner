<!-- src/components/Dashboard.vue -->
<template>
    <div>
      <h1 class="text-3xl font-bold mb-6">Dashboard</h1>
  
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <!-- Gráfico de Entradas e Saídas -->
        <div class="bg-white p-4 rounded shadow">
          <h2 class="text-xl font-semibold mb-4">Entradas vs Saídas</h2>
          <v-chart :option="movementOption" style="height: 300px;"></v-chart>
        </div>
  
        <!-- Gráfico de Estoque Atual -->
        <div class="bg-white p-4 rounded shadow">
          <h2 class="text-xl font-semibold mb-4">Estoque Atual de Toners</h2>
          <v-chart :option="stockOption" style="height: 300px;"></v-chart>
        </div>
      </div>
  
      <div class="bg-white p-4 rounded shadow mb-6">
        <h2 class="text-xl font-semibold mb-4">Toners com Estoque Abaixo do Nível Mínimo</h2>
        <table class="min-w-full bg-white">
          <thead class="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <tr>
              <th class="py-3 px-6 text-left">ID</th>
              <th class="py-3 px-6 text-left">Nome do Toner</th>
              <th class="py-3 px-6 text-left">Estoque Atual</th>
              <th class="py-3 px-6 text-left">Nível Mínimo</th>
            </tr>
          </thead>
          <tbody class="text-gray-600 text-sm font-light">
            <tr
              v-for="toner in lowStockToners"
              :key="toner.id"
              class="border-b border-gray-200 hover:bg-gray-100"
            >
              <td class="py-3 px-6 text-left">{{ toner.id }}</td>
              <td class="py-3 px-6 text-left">{{ toner.name }}</td>
              <td class="py-3 px-6 text-left">{{ toner.currentStock }}</td>
              <td class="py-3 px-6 text-left">{{ toner.minLevel }}</td>
            </tr>
            <tr v-if="lowStockToners.length === 0">
              <td colspan="4" class="text-center py-4">Todos os toners estão acima do nível mínimo.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <script>
  import StorageService from '../services/StorageService'
  
  export default {
    name: 'DashboardList',
    data() {
      return {
        toners: [],
        movements: [],
        movementOption: {},
        stockOption: {},
      }
    },
    computed: {
      // Filtra os toners com estoque abaixo do nível mínimo
      lowStockToners() {
        return this.toners.filter(toner => toner.currentStock < toner.minLevel)
      },
      // Calcula as entradas e saídas por mês
      movementData() {
        const data = {}
        this.movements.forEach(movement => {
          const date = new Date(movement.date)
          const month = date.toLocaleString('default', { month: 'short', year: 'numeric' })
          if (!data[month]) {
            data[month] = { entrada: 0, saida: 0 }
          }
          if (movement.type === 'entrada') {
            data[month].entrada += movement.quantity
          } else if (movement.type === 'saida') {
            data[month].saida += movement.quantity
          }
        })
        const sortedMonths = Object.keys(data).sort((a, b) => {
          const [monthA, yearA] = a.split(' ')
          const [monthB, yearB] = b.split(' ')
          const dateA = new Date(`${monthA} 1, ${yearA}`)
          const dateB = new Date(`${monthB} 1, ${yearB}`)
          return dateA - dateB
        })
        const entradas = sortedMonths.map(month => data[month].entrada)
        const saidas = sortedMonths.map(month => data[month].saida)
        return { sortedMonths, entradas, saidas }
      },
      // Prepara os dados para o gráfico de estoque
      stockData() {
        const labels = this.toners.map(toner => toner.name)
        const data = this.toners.map(toner => toner.currentStock)
        return { labels, data }
      },
    },
    created() {
      this.loadData()
    },
    methods: {
      loadData() {
        this.toners = StorageService.getData('toners')
        this.movements = StorageService.getData('movements') || []
        this.prepareCharts()
      },
      prepareCharts() {
        // Gráfico de Entradas vs Saídas
        this.movementOption = {
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: ['Entradas', 'Saídas']
          },
          xAxis: {
            type: 'category',
            data: this.movementData.sortedMonths
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              name: 'Entradas',
              type: 'bar',
              data: this.movementData.entradas,
              itemStyle: {
                color: '#67C23A'
              }
            },
            {
              name: 'Saídas',
              type: 'bar',
              data: this.movementData.saidas,
              itemStyle: {
                color: '#F56C6C'
              }
            }
          ]
        }
  
        // Gráfico de Estoque Atual
        this.stockOption = {
          tooltip: {
            trigger: 'item'
          },
          legend: {
            orient: 'vertical',
            left: 'left',
          },
          series: [
            {
              name: 'Estoque Atual',
              type: 'pie',
              radius: '50%',
              data: this.stockData.labels.map((label, index) => ({
                value: this.stockData.data[index],
                name: label
              })),
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        }
      }
    }
  }
  </script>
  
  <style scoped>
  .headline {
    font-weight: bold;
  }
  </style>
  