<!-- DashboardList.vue -->
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
      
      <!-- Movimentações Recentes -->
      <el-card class="shadow-lg col-span-1 md:col-span-2 lg:col-span-4">
        <h2 class="text-xl font-semibold mb-4">Movimentações Recentes</h2>
        <el-table :data="recentMovements" style="width: 100%" stripe>
          <el-table-column prop="id" label="ID" width="60"></el-table-column>
          <el-table-column prop="type" label="Tipo" width="100">
            <template #default="{ row }">
              <span class="capitalize">{{ row.type }}</span>
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
      <el-card class="shadow-lg col-span-1 md:col-span-2 lg:col-span-4">
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
        </el-table>
      </el-card>
    </div>
  </div>
</template>

<script>
import ApiService from '../services/ApiService'
import dayjs from 'dayjs'
import { DatabaseOutlined, UsergroupAddOutlined } from '@element-plus/icons-vue'

export default {
  name: 'DashboardList',
  components: {
    DatabaseOutlined,
    UsergroupAddOutlined,
  },
  data() {
    return {
      totalToners: 0,
      totalSuppliers: 0,
      recentMovements: [],
      lowStockToners: [],
    }
  },
  created() {
    this.fetchDashboardData()
  },
  methods: {
    fetchDashboardData() {
      ApiService.getToners()
        .then(response => {
          this.totalToners = response.data.length;
          this.lowStockToners = response.data.filter(toner => toner.current_stock < toner.min_level);
        })
        .catch(() => {
          this.$message.error('Erro ao carregar toners.');
        });
      
      ApiService.getSuppliers()
        .then(response => {
          this.totalSuppliers = response.data.length;
        })
        .catch(() => {
          this.$message.error('Erro ao carregar fornecedores.');
        });
      
      ApiService.getMovements()
        .then(response => {
          this.recentMovements = response.data.slice(0, 5);
        })
        .catch(() => {
          this.$message.error('Erro ao carregar movimentações.');
        });
    },
    formatDate(dateStr) {
      if (!dateStr) {
        return 'Data não disponível';
      }
      const date = dayjs(dateStr);
      if (!date.isValid()) {
        return 'Data inválida';
      }
      return date.format('DD/MM/YYYY HH:mm');
    }
  },
}
</script>

<style scoped>
/* Estilos adicionais, se necessário */
</style>
