import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ProductList from '../components/ProductList.vue'
import ProductCreate from '../components/ProductCreate.vue'
import ProductEdit from '../components/ProductEdit.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: ProductList
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/products',
      name: 'products',
      component: ProductList
    },
    {
      path: '/products/create',
      name: 'product-create',
      component: ProductCreate
    },
    {
      path: '/products/:id',
      name: 'product-edit',
      component: ProductEdit
    }
  ]
})

export default router