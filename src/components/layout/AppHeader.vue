<template>
  <header class="app-header">
    <div class="header-container">
      <div class="header-left">
        <router-link to="/dashboard" class="logo">
          <img src="/logo.png" alt="Lubpar" class="logo-img" />
          <span class="logo-text">Lubpar Portal</span>
        </router-link>
      </div>

      <nav class="header-nav">
        <router-link to="/dashboard" class="nav-link">
          <i class="pi pi-home"></i>
          Dashboard
        </router-link>
        <router-link to="/prospects" class="nav-link">
          <i class="pi pi-users"></i>
          Prospects
        </router-link>
        <router-link to="/tracking" class="nav-link">
          <i class="pi pi-map-marker"></i>
          Rastreamento
        </router-link>
        <router-link to="/orders" class="nav-link">
          <i class="pi pi-shopping-cart"></i>
          Pedidos
        </router-link>
        <router-link to="/reports" class="nav-link">
          <i class="pi pi-chart-bar"></i>
          Relatórios
        </router-link>
      </nav>

      <div class="header-right">
        <div class="user-menu">
          <Button 
            type="button" 
            icon="pi pi-user" 
            :label="authStore.user?.name || 'Usuário'"
            class="p-button-text"
            @click="toggleUserMenu"
          />
          <Menu 
            ref="userMenuRef" 
            :model="userMenuItems" 
            :popup="true"
          />
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import Button from 'primevue/button'
import Menu from 'primevue/menu'

const router = useRouter()
const authStore = useAuthStore()
const userMenuRef = ref()

const userMenuItems = [
  {
    label: 'Perfil',
    icon: 'pi pi-user',
    command: () => {
      // Navigate to profile
    }
  },
  {
    label: 'Configurações',
    icon: 'pi pi-cog',
    command: () => {
      // Navigate to settings
    }
  },
  {
    separator: true
  },
  {
    label: 'Sair',
    icon: 'pi pi-sign-out',
    command: () => {
      authStore.logout()
      router.push('/login')
    }
  }
]

const toggleUserMenu = (event) => {
  userMenuRef.value.toggle(event)
}
</script>

<style scoped>
.app-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 80px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.header-left {
  display: flex;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: white;
  font-weight: 600;
  font-size: 1.25rem;
}

.logo-img {
  height: 40px;
  margin-right: 12px;
}

.logo-text {
  color: white;
}

.header-nav {
  display: flex;
  align-items: center;
  gap: 32px;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 8px;
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.nav-link:hover {
  color: white;
  background: rgba(255, 255, 255, 0.1);
}

.nav-link.router-link-active {
  color: white;
  background: rgba(255, 255, 255, 0.2);
}

.header-right {
  display: flex;
  align-items: center;
}

.user-menu :deep(.p-button) {
  color: white;
}

.user-menu :deep(.p-button:hover) {
  background: rgba(255, 255, 255, 0.1);
}

@media (max-width: 768px) {
  .header-nav {
    display: none;
  }
  
  .logo-text {
    display: none;
  }
}
</style>