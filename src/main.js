import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
//import '@/assets/styles/_forms.css'
//import '@/assets/styles/_table_base.css'

createApp(App).use(store).use(router).mount('#app')
