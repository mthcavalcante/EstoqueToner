// src/main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Importar Tailwind CSS
import './assets/tailwind.css'

// Importar Element Plus e seus estilos
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// Importar ECharts
import VueECharts from 'vue-echarts'
import 'echarts'

const app = createApp(App)

// Registrar o componente globalmente
app.component('v-chart', VueECharts)

app
  .use(router)
  .use(ElementPlus)
  .mount('#app')
