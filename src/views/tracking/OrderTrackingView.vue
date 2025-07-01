<template>
  <div class="order-tracking-view">
    <div class="page-header">
      <div class="header-content">
        <h1>Rastreamento do Pedido #{{ $route.params.orderId }}</h1>
        <p>Acompanhe o status detalhado do pedido</p>
      </div>
      <div class="header-actions">
        <Button 
          label="Voltar" 
          icon="pi pi-arrow-left"
          class="p-button-secondary"
          @click="$router.push('/tracking')"
        />
      </div>
    </div>

    <Card>
      <template #content>
        <div class="coming-soon">
          <i class="pi pi-map-marker" style="font-size: 4rem; color: #95a5a6;"></i>
          <h2>Rastreamento Detalhado</h2>
          <p>Esta funcionalidade está em desenvolvimento e será disponibilizada em breve.</p>
          <Button 
            label="Voltar ao Rastreamento"
            icon="pi pi-arrow-left"
            @click="$router.push('/tracking')"
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
.order-tracking-view {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
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

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 16px;
  }
}
</style>