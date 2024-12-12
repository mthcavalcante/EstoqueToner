// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import TonerList from '../components/TonerList.vue'
import TonerForm from '../components/TonerForm.vue'
import SupplierList from '../components/SupplierList.vue'
import SupplierForm from '../components/SupplierForm.vue'
import StockMovement from '../components/StockMovement.vue'
import StockReports from '../components/StockReports.vue'

const routes = [
  { path: '/', redirect: '/toners' },
  { path: '/toners', component: TonerList },
  { path: '/toners/add', component: TonerForm },
  { path: '/toners/edit/:id', component: TonerForm, props: true },
  { path: '/suppliers', component: SupplierList },
  { path: '/suppliers/add', component: SupplierForm },
  { path: '/suppliers/edit/:id', component: SupplierForm, props: true },
  { path: '/movements', component: StockMovement },
  { path: '/reports', component: StockReports },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
