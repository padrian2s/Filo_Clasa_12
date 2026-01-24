import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import './assets/main.css'

import Home from './views/Home.vue'
import Chapter from './views/Chapter.vue'
import Page from './views/Page.vue'
import Test from './views/Test.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: Home },
    { path: '/capitol/:id', name: 'chapter', component: Chapter, props: true },
    { path: '/pagina/:page', name: 'page', component: Page, props: true },
    { path: '/test', name: 'test', component: Test },
  ],
  scrollBehavior(to, from, savedPosition) {
    console.log('scrollBehavior called', { to: to.path, from: from.path })
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0 }
  }
})

const pinia = createPinia()
const app = createApp(App)
app.use(pinia)
app.use(router)
app.mount('#app')
