<template>
  <div class="tracking-view">
    <div class="page-header">
      <div class="header-content">
        <h1>Rastreamento</h1>
        <p>Acompanhe o status dos seus pedidos e entregas</p>
      </div>
    </div>

    <Card class="search-card">
      <template #title>Buscar Rastreamento</template>
      <template #content>
        <div class="search-form">
          <div class="search-fields">
            <div class="field-group">
              <label>Número do Pedido</label>
              <InputText 
                v-model="searchForm.orderNumber"
                placeholder="Digite o número do pedido"
              />
            </div>
            
            <div class="field-group">
              <label>CPF/CNPJ</label>
              <InputText 
                v-model="searchForm.document"
                placeholder="Digite o CPF ou CNPJ"
              />
            </div>
            
            <div class="field-group">
              <label>Período</label>
              <Calendar 
                v-model="searchForm.dateRange"
                selectionMode="range"
                :manualInput="false"
                placeholder="Selecione o período"
              />
            </div>
          </div>
          
          <div class="search-actions">
            <Button 
              label="Buscar"
              icon="pi pi-search"
              @click="searchTracking"
              :loading="loading"
            />
            <Button 
              label="Limpar"
              icon="pi pi-times"
              class="p-button-secondary"
              @click="clearSearch"
            />
          </div>
        </div>
      </template>
    </Card>

    <Card v-if="trackingResults.length > 0" class="results-card">
      <template #title>
        Resultados da Busca ({{ trackingResults.length }})
      </template>
      <template #content>
        <DataTable 
          :value="trackingResults"
          responsiveLayout="scroll"
          :paginator="true"
          :rows="10"
        >
          <Column field="orderNumber" header="Pedido" sortable>
            <template #body="{ data }">
              <router-link 
                :to="`/tracking/order/${data.orderNumber}`"
                class="order-link"
              >
                {{ data.orderNumber }}
              </router-link>
            </template>
          </Column>
          
          <Column field="customer" header="Cliente" sortable />
          
          <Column field="status" header="Status" sortable>
            <template #body="{ data }">
              <Tag 
                :value="data.status" 
                :severity="getStatusSeverity(data.status)"
              />
            </template>
          </Column>
          
          <Column field="lastUpdate" header="Última Atualização" sortable>
            <template #body="{ data }">
              {{ formatDate(data.lastUpdate) }}
            </template>
          </Column>
          
          <Column field="estimatedDelivery" header="Previsão de Entrega" sortable>
            <template #body="{ data }">
              {{ data.estimatedDelivery ? formatDate(data.estimatedDelivery) : '-' }}
            </template>
          </Column>
          
          <Column header="Ações" headerStyle="width: 8rem">
            <template #body="{ data }">
              <div class="action-buttons">
                <Button 
                  icon="pi pi-eye"
                  class="p-button-text p-button-sm"
                  @click="viewTracking(data)"
                  v-tooltip="'Ver Detalhes'"
                />
                <Button 
                  icon="pi pi-map-marker"
                  class="p-button-text p-button-sm"
                  @click="showMap(data)"
                  v-tooltip="'Ver no Mapa'"
                />
              </div>
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>

    <Card v-else-if="searchPerformed && !loading" class="no-results-card">
      <template #content>
        <div class="no-results">
          <i class="pi pi-search" style="font-size: 3rem; color: #95a5a6;"></i>
          <h3>Nenhum resultado encontrado</h3>
          <p>Tente ajustar os critérios de busca e tente novamente.</p>
        </div>
      </template>
    </Card>

    <!-- Quick Access Section -->
    <Card class="quick-access-card">
      <template #title>Acesso Rápido</template>
      <template #content>
        <div class="quick-access-grid">
          <div class="quick-access-item" @click="quickSearch('pending')">
            <i class="pi pi-clock"></i>
            <h4>Pendentes</h4>
            <p>{{ quickStats.pending }} pedidos</p>
          </div>
          
          <div class="quick-access-item" @click="quickSearch('transit')">
            <i class="pi pi-truck"></i>
            <h4>Em Trânsito</h4>
            <p>{{ quickStats.transit }} pedidos</p>
          </div>
          
          <div class="quick-access-item" @click="quickSearch('delivered')">
            <i class="pi pi-check-circle"></i>
            <h4>Entregues</h4>
            <p>{{ quickStats.delivered }} pedidos</p>
          </div>
          
          <div class="quick-access-item" @click="quickSearch('delayed')">
            <i class="pi pi-exclamation-triangle"></i>
            <h4>Atrasados</h4>
            <p>{{ quickStats.delayed }} pedidos</p>
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { useTrackingStore } from '../../stores/tracking'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

import Card from 'primevue/card'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Calendar from 'primevue/calendar'
import Tag from 'primevue/tag'

const router = useRouter()
const toast = useToast()
const trackingStore = useTrackingStore()

const loading = ref(false)
const searchPerformed = ref(false)
const trackingResults = ref([])

const searchForm = ref({
  orderNumber: '',
  document: '',
  dateRange: null
})

const quickStats = ref({
  pending: 0,
  transit: 0,
  delivered: 0,
  delayed: 0
})

const formatDate = (date) => {
  return format(new Date(date), 'dd/MM/yyyy HH:mm', { locale: ptBR })
}

const getStatusSeverity = (status) => {
  const severityMap = {
    'Pendente': 'warning',
    'Em Trânsito': 'info',
    'Entregue': 'success',
    'Atrasado': 'danger',
    'Cancelado': 'danger'
  }
  return severityMap[status] || 'info'
}

const searchTracking = async () => {
  if (!searchForm.value.orderNumber && !searchForm.value.document) {
    toast.add({
      severity: 'warn',
      summary: 'Atenção',
      detail: 'Informe pelo menos o número do pedido ou CPF/CNPJ',
      life: 3000
    })
    return
  }

  loading.value = true
  searchPerformed.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    trackingResults.value = [
      {
        id: 1,
        orderNumber: '12345',
        customer: 'João Silva',
        status: 'Em Trânsito',
        lastUpdate: new Date(),
        estimatedDelivery: new Date(Date.now() + 86400000)
      },
      {
        id: 2,
        orderNumber: '12346',
        customer: 'Maria Santos',
        status: 'Entregue',
        lastUpdate: new Date(Date.now() - 3600000),
        estimatedDelivery: new Date(Date.now() - 3600000)
      }
    ]
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Erro',
      detail: 'Erro ao buscar rastreamento',
      life: 5000
    })
  } finally {
    loading.value = false
  }
}

const clearSearch = () => {
  searchForm.value = {
    orderNumber: '',
    document: '',
    dateRange: null
  }
  trackingResults.value = []
  searchPerformed.value = false
}

const viewTracking = (tracking) => {
  router.push(`/tracking/order/${tracking.orderNumber}`)
}

const showMap = (tracking) => {
  toast.add({
    severity: 'info',
    summary: 'Mapa',
    detail: 'Funcionalidade de mapa em desenvolvimento',
    life: 3000
  })
}

const quickSearch = (status) => {
  // Implement quick search by status
  searchForm.value = {
    orderNumber: '',
    document: '',
    dateRange: null
  }
  
  // Simulate search by status
  searchTracking()
}

const loadQuickStats = async () => {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    
    quickStats.value = {
      pending: 15,
      transit: 23,
      delivered: 156,
      delayed: 3
    }
  } catch (error) {
    console.error('Error loading quick stats:', error)
  }
}

onMounted(() => {
  loadQuickStats()
})
</script>

<style scoped>
.tracking-view {
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

.search-card {
  margin-bottom: 24px;
}

.search-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.search-fields {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field-group label {
  font-weight: 500;
  color: #2c3e50;
  font-size: 0.9rem;
}

.search-actions {
  display: flex;
  gap: 12px;
}

.results-card {
  margin-bottom: 24px;
}

.order-link {
  color: #3498db;
  text-decoration: none;
  font-weight: 500;
}

.order-link:hover {
  text-decoration: underline;
}

.action-buttons {
  display: flex;
  gap: 4px;
}

.no-results-card {
  margin-bottom: 24px;
}

.no-results {
  text-align: center;
  padding: 40px 20px;
}

.no-results h3 {
  color: #2c3e50;
  margin: 16px 0 8px 0;
}

.no-results p {
  color: #7f8c8d;
  margin: 0;
}

.quick-access-card {
  margin-bottom: 24px;
}

.quick-access-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.quick-access-item {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid transparent;
}

.quick-access-item:hover {
  background: #e9ecef;
  border-color: #3498db;
  transform: translateY(-2px);
}

.quick-access-item i {
  font-size: 2rem;
  color: #3498db;
  margin-bottom: 12px;
}

.quick-access-item h4 {
  color: #2c3e50;
  margin: 0 0 8px 0;
}

.quick-access-item p {
  color: #7f8c8d;
  margin: 0;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .search-fields {
    grid-template-columns: 1fr;
  }
  
  .search-actions {
    flex-direction: column;
  }
  
  .quick-access-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>