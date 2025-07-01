<template>
  <div class="orders-view">
    <div class="page-header">
      <div class="header-content">
        <h1>Pedidos</h1>
        <p>Gerencie todos os pedidos do sistema</p>
      </div>
    </div>

    <Card>
      <template #content>
        <div class="coming-soon">
          <i class="pi pi-shopping-cart" style="font-size: 4rem; color: #95a5a6;"></i>
          <h2>Módulo de Pedidos</h2>
          <p>Esta funcionalidade está em desenvolvimento e será disponibilizada em breve.</p>
          <Button 
            label="Voltar ao Dashboard"
            icon="pi pi-home"
            @click="$router.push('/dashboard')"
          />
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup>
import Card from 'primevue/card'
import Button from 'primevue/button'
</script>

<style scoped>
.orders-view {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 24px;
}

.page-header h1 {
  color: #2c3e50;
  margin-bottom: 8px;
}

.page-header p {
  color: #7f8c8d;
  margin: 0;
}

.coming-soon {
  text-align: center;
  padding: 60px 20px;
}

.coming-soon h2 {
  color: #2c3e50;
  margin: 24px 0 16px 0;
}

.coming-soon p {
  color: #7f8c8d;
  margin-bottom: 32px;
  font-size: 1.1rem;
}
</style>