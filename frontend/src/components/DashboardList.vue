<!-- src/components/DashboardList.vue -->
<template>
  <div class="p-6 bg-gray-100 min-h-screen">
    <h1 class="text-3xl font-bold mb-6">Dashboard</h1>
    
    <!-- Métricas Principais -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <!-- Total de Toners -->
      <el-card class="shadow-lg">
        <div class="flex items-center">
          <DatabaseOutlined class="text-4xl text-blue-500 mr-4" />
          <div>
            <h2 class="text-xl font-semibold">Total de Toners</h2>
            <p class="text-2xl">{{ totalToners }}</p>
          </div>
        </div>
      </el-card>
      
      <!-- Total de Fornecedores -->
      <el-card class="shadow-lg">
        <div class="flex items-center">
          <UsergroupAddOutlined class="text-4xl text-green-500 mr-4" />
          <div>
            <h2 class="text-xl font-semibold">Total de Fornecedores</h2>
            <p class="text-2xl">{{ totalSuppliers }}</p>
          </div>
        </div>
      </el-card>
      
      <!-- Total de Movimentações -->
      <el-card class="shadow-lg">
        <div class="flex items-center">
          <List class="text-4xl text-yellow-500 mr-4" />
          <div>
            <h2 class="text-xl font-semibold">Total de Movimentações</h2>
            <p class="text-2xl">{{ totalMovements }}</p>
          </div>
        </div>
      </el-card>
      
      <!-- Última Atualização -->
      <el-card class="shadow-lg">
        <div class="flex items-center">
          <TimeIcon class="text-4xl text-purple-500 mr-4" />
          <div>
            <h2 class="text-xl font-semibold">Última Atualização</h2>
            <p class="text-lg">{{ lastUpdate }}</p>
          </div>
        </div>
      </el-card>
    </div>
    
    <!-- Gráficos e Tabelas -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <!-- Gráfico de Movimentações por Mês -->
      <el-card class="shadow-lg">
        <h2 class="text-xl font-semibold mb-4">Movimentações por Mês</h2>
        <v-chart :option="movementsChartOptions" style="height: 300px;"></v-chart>
      </el-card>
      
      <!-- Gráfico de Distribuição de Estoque -->
      <el-card class="shadow-lg">
        <h2 class="text-xl font-semibold mb-4">Distribuição de Estoque</h2>
        <v-chart :option="stockDistributionChartOptions" style="height: 300px;"></v-chart>
      </el-card>
    </div>
    
    <!-- Movimentações Recentes -->
    <el-card class="shadow-lg mb-8">
      <h2 class="text-xl font-semibold mb-4">Movimentações Recentes</h2>
      <el-table :data="recentMovements" style="width: 100%" stripe>
        <el-table-column prop="id" label="ID" width="60"></el-table-column>
        <el-table-column prop="type" label="Tipo" width="100">
          <template #default="{ row }">
            <el-tag :type="row.type === 'entrada' ? 'success' : 'danger'">
              {{ capitalize(row.type) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="toner.name" label="Toner"></el-table-column>
        <el-table-column prop="quantity" label="Quantidade" width="100"></el-table-column>
        <el-table-column prop="created_at" label="Data de Criação" width="180">
          <template #default="{ row }">
            {{ formatDate(row.created_at || row.createdAt || row.date) }}
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    
    <!-- Alertas de Estoque Baixo -->
    <el-card class="shadow-lg mb-8">
      <h2 class="text-xl font-semibold mb-4">Alertas de Estoque Baixo</h2>
      <el-alert
        v-if="lowStockToners.length === 0"
        title="Nenhum toner com estoque baixo."
        type="success"
        show-icon
      ></el-alert>
      <el-table
        v-else
        :data="lowStockToners"
        style="width: 100%"
        stripe
        border
      >
        <el-table-column prop="id" label="ID" width="60"></el-table-column>
        <el-table-column prop="name" label="Nome do Toner"></el-table-column>
        <el-table-column prop="current_stock" label="Estoque Atual" width="150">
          <template #default="{ row }">
            <span class="text-red-600 font-semibold">{{ row.current_stock }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="min_level" label="Nível Mínimo" width="150"></el-table-column>
        <el-table-column label="Ações" width="100">
          <template #default="{ row }">
            <el-button type="primary" size="mini" @click="viewTonerDetails(row)">Detalhes</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import ApiService from '../services/ApiService'
import dayjs from 'dayjs'
import { DatabaseOutlined, UsergroupAddOutlined, List, Time as TimeIcon } from '@element-plus/icons-vue'
import VChart from 'vue-echarts'
import 'echarts'

export default {
  name: 'DashboardList',
  components: {
    DatabaseOutlined,
    UsergroupAddOutlined,
    List,
    TimeIcon, // Renomeado para evitar conflito
    VChart,
  },
  data() {
    return {
      totalToners: 0,
      totalSuppliers: 0,
      totalMovements: 0,
      lastUpdate: '',
      recentMovements: [],
      lowStockToners: [],
      movementsByMonth: {},
      stockDistribution: {},
      movementsChartOptions: {},
      stockDistributionChartOptions: {},
    }
  },
  created() {
    this.fetchDashboardData()
  },
  methods: {
    fetchDashboardData() {
      // Fetch Toners
      ApiService.getToners()
        .then(response => {
          const toners = response.data
          this.totalToners = toners.length
          this.lowStockToners = toners.filter(toner => toner.current_stock < toner.min_level)
          this.calculateStockDistribution(toners)
        })
        .catch(() => {
          this.$message.error('Erro ao carregar toners.')
        })
      
      // Fetch Suppliers
      ApiService.getSuppliers()
        .then(response => {
          const suppliers = response.data
          this.totalSuppliers = suppliers.length
        })
        .catch(() => {
          this.$message.error('Erro ao carregar fornecedores.')
        })
      
      // Fetch Movements
      ApiService.getMovements()
        .then(response => {
          const movements = response.data
          this.totalMovements = movements.length
          this.recentMovements = movements.slice(-5).reverse()
          this.calculateMovementsByMonth(movements)
        })
        .catch(() => {
          this.$message.error('Erro ao carregar movimentações.')
        })
      
      // Set Last Update
      this.lastUpdate = dayjs().format('DD/MM/YYYY HH:mm')
    },
    calculateMovementsByMonth(movements) {
      // Initialize counts
      const counts = {}
      // Loop through the movements and count per month
      movements.forEach(movement => {
        const month = dayjs(movement.created_at || movement.createdAt || movement.date).format('MMM YYYY')
        counts[month] = (counts[month] || 0) + 1
      })
      this.movementsByMonth = counts
      this.initializeMovementsChart()
    },
    calculateStockDistribution(toners) {
      // Calculate stock distribution by toner
      const distribution = toners.map(toner => ({
        name: toner.name,
        value: toner.current_stock,
      }))
      this.stockDistribution = distribution
      this.initializeStockDistributionChart()
    },
    initializeMovementsChart() {
      const months = Object.keys(this.movementsByMonth)
      const data = Object.values(this.movementsByMonth)
      
      this.movementsChartOptions = {
        title: {
          text: 'Movimentações por Mês',
          left: 'center'
        },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          data: months
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: data,
            type: 'bar',
            barWidth: '50%',
            itemStyle: {
              color: '#409EFF'
            }
          }
        ]
      }
    },
    initializeStockDistributionChart() {
      this.stockDistributionChartOptions = {
        title: {
          text: 'Distribuição de Estoque por Toner',
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        series: [
          {
            name: 'Estoque',
            type: 'pie',
            radius: '50%',
            data: this.stockDistribution,
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
    },
    formatDate(dateStr) {
      if (!dateStr) {
        return 'Data não disponível'
      }
      const date = dayjs(dateStr)
      if (!date.isValid()) {
        return 'Data inválida'
      }
      return date.format('DD/MM/YYYY HH:mm')
    },
    capitalize(word) {
      if (!word) return ''
      return word.charAt(0).toUpperCase() + word.slice(1)
    },
    viewTonerDetails(toner) {
      // Implementar a lógica para visualizar detalhes do toner, possivelmente redirecionando para outra rota
      this.$router.push({ name: 'EditToner', params: { id: toner.id } })
    }
  },
}
</script>

<style scoped>
/* Estilos adicionais, se necessário */
</style>
