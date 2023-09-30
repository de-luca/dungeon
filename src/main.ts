import './main.scss'
import { createApp } from 'vue'
import { createPinia } from 'pinia';
import { router } from './router';
import App from './App.vue'
import Modal from './components/Modal.vue'

createApp(App)
    .component('modal', Modal)
    .use(router)
    .use(createPinia())
    .mount('#app')
