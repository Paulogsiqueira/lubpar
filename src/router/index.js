import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/auth/LoginView.vue')
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../views/DashboardView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/prospects',
    name: 'Prospects',
    component: () => import('../views/prospects/ProspectsView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/prospects/new',
    name: 'NewProspect',
    component: () => import('../views/prospects/ProspectFormView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/prospects/:id/edit',
    name: 'EditProspect',
    component: () => import('../views/prospects/ProspectFormView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/tracking',
    name: 'Tracking',
    component: () => import('../views/tracking/TrackingView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/tracking/order/:orderId',
    name: 'OrderTracking',
    component: () => import('../views/tracking/OrderTrackingView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/orders',
    name: 'Orders',
    component: () => import('../views/orders/OrdersView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/reports',
    name: 'Reports',
    component: () => import('../views/reports/ReportsView.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.name === 'Login' && authStore.isAuthenticated) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router