import { createApp } from 'vue'
import App from './App.vue'
import LiquorTree from 'liquor-tree'

const app = createApp(App)
app.use(LiquorTree)
app.mount('#app')