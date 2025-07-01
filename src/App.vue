<template>
  <div id="app">
    <AppHeader v-if="!isLoginPage" />
    <main class="main-content" :class="{ 'no-header': isLoginPage }">
      <router-view />
    </main>
    <AppFooter v-if="!isLoginPage" />
    
    <!-- Global Toast -->
    <Toast />
    
    <!-- Global Confirmation Dialog -->
    <ConfirmDialog />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from './components/layout/AppHeader.vue'
import AppFooter from './components/layout/AppFooter.vue'
import Toast from 'primevue/toast'
import ConfirmDialog from 'primevue/confirmdialog'

const route = useRoute()

const isLoginPage = computed(() => {
  return route.name === 'Login'
})
</script>

<style scoped>
.main-content {
  min-height: calc(100vh - 120px);
  padding-top: 80px;
}

.main-content.no-header {
  padding-top: 0;
  min-height: 100vh;
}
</style>