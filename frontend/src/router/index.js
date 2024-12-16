// src/router/index.js

import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../components/DashboardList.vue'
import TonerList from '../components/TonerList.vue'
import TonerForm from '../components/TonerForm.vue'
import SupplierList from '../components/SupplierList.vue'
import SupplierForm from '../components/SupplierForm.vue'
import StockMovement from '../components/StockMovement.vue'
import StockReports from '../components/StockReports.vue'
import NotFoundComponent from '../components/NotFound.vue'

const routes = [
  { path: '/', name: 'Home', redirect: '/dashboard' }, // Opcional: Redirecionar '/' para '/dashboard'
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/toners', name: 'TonerList', component: TonerList },
  { path: '/toners/add', name: 'AddToner', component: TonerForm },
  { path: '/toners/edit/:id', name: 'EditToner', component: TonerForm, props: true },
  { path: '/suppliers', name: 'SupplierList', component: SupplierList },
  { path: '/suppliers/add', name: 'AddSupplier', component: SupplierForm },
  { path: '/suppliers/edit/:id', name: 'EditSupplier', component: SupplierForm, props: true },
  { path: '/movements', name: 'StockMovement', component: StockMovement },
  { path: '/reports', name: 'StockReports', component: StockReports },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFoundComponent }, // Opcional: Rota de fallback para páginas não encontradas
]


const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
