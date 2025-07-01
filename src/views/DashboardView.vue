<template>
  <div class="dashboard">
    <div class="dashboard-header">
      <h1>Dashboard</h1>
      <p>Bem-vindo ao Lubpar Portal</p>
    </div>

    <div class="dashboard-stats">
      <div class="stat-card">
        <div class="stat-icon">
          <i class="pi pi-users"></i>
        </div>
        <div class="stat-content">
          <h3>{{ stats.prospects }}</h3>
          <p>Prospects Ativos</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">
          <i class="pi pi-shopping-cart"></i>
        </div>
        <div class="stat-content">
          <h3>{{ stats.orders }}</h3>
          <p>Pedidos do Mês</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">
          <i class="pi pi-map-marker"></i>
        </div>
        <div class="stat-content">
          <h3>{{ stats.tracking }}</h3>
          <p>Entregas em Andamento</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">
          <i class="pi pi-dollar"></i>
        </div>
        <div class="stat-content">
          <h3>R$ {{ formatCurrency(stats.revenue) }}</h3>
          <p>Faturamento do Mês</p>
        </div>
      </div>
    </div>

    <div class="dashboard-content">
      <div class="dashboard-section">
        <Card>
          <template #title>
            <div class="section-header">
              <h2>Prospects Recentes</h2>
              <Button 
                label="Ver Todos" 
                icon="pi pi-arrow-right" 
                class="p-button-text"
                @click="$router.push('/prospects')"
              />
            </div>
          </template>
          <template #content>
            <DataTable 
              :value="recentProspects" 
              :loading="loading"
              responsiveLayout="scroll"
            >
              <Column field="name" header="Nome" />
              <Column field="company" header="Empresa" />
              <Column field="status" header="Status">
                <template #body="{ data }">
                  <Tag 
                    :value="data.status" 
                    :severity="getStatusSeverity(data.status)"
                  />
                </template>
              </Column>
              <Column field="createdAt" header="Data">
                <template #body="{ data }">
                  {{ formatDate(data.createdAt) }}
                </template>
              </Column>
            </DataTable>
          </template>
        </Card>
      </div>

      <div class="dashboard-section">
        <Card>
          <template #title>
            <div class="section-header">
              <h2>Atividades Recentes</h2>
              <Button 
                label="Ver Todas" 
                icon="pi pi-arrow-right" 
                class="p-button-text"
                @click="showAllActivities"
              />
            </div>
          </template>
          <template #content>
            <Timeline 
              :value="recentActivities" 
              align="left"
              class="activity-timeline"
            >
              <template #content="{ item }">
                <div class="activity-item">
                  <h4>{{ item.title }}</h4>
                  <p>{{ item.description }}</p>
                  <small>{{ formatDate(item.timestamp) }}</small>
                </div>
              </template>
            </Timeline>
          </template>
        </Card>
      </div>
    </div>

    <div class="dashboard-actions">
      <Card>
        <template #title>Ações Rápidas</template>
        <template #content>
          <div class="quick-actions">
            <Button 
              label="Novo Prospect" 
              icon="pi pi-plus"
              class="p-button-success"
              @click="$router.push('/prospects/new')"
            />
            <Button 
              label="Rastrear Pedido" 
              icon="pi pi-search"
              class="p-button-info"
              @click="$router.push('/tracking')"
            />
            <Button 
              label="Gerar Relatório" 
              icon="pi pi-file-pdf"
              class="p-button-warning"
              @click="$router.push('/reports')"
            />
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import Card from 'primevue/card'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import Timeline from 'primevue/timeline'

const loading = ref(false)

const stats = ref({
  prospects: 0,
  orders: 0,
  tracking: 0,
  revenue: 0
})

const recentProspects = ref([])
const recentActivities = ref([])

const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value)
}

const formatDate = (date) => {
  return format(new Date(date), 'dd/MM/yyyy HH:mm', { locale: ptBR })
}

const getStatusSeverity = (status) => {
  const severityMap = {
    'Novo': 'info',
    'Em Contato': 'warning',
    'Proposta Enviada': 'success',
    'Fechado': 'success',
    'Perdido': 'danger'
  }
  return severityMap[status] || 'info'
}

const showAllActivities = () => {
  // Navigate to activities page or show modal
}

const loadDashboardData = async () => {
  loading.value = true
  try {
    // Simulate API calls
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    stats.value = {
      prospects: 127,
      orders: 45,
      tracking: 23,
      revenue: 125000.50
    }
    
    recentProspects.value = [
      {
        id: 1,
        name: 'João Silva',
        company: 'Empresa ABC',
        status: 'Novo',
        createdAt: new Date()
      },
      {
        id: 2,
        name: 'Maria Santos',
        company: 'Empresa XYZ',
        status: 'Em Contato',
        createdAt: new Date(Date.now() - 86400000)
      }
    ]
    
    recentActivities.value = [
      {
        title: 'Novo prospect cadastrado',
        description: 'João Silva foi adicionado como prospect',
        timestamp: new Date()
      },
      {
        title: 'Pedido entregue',
        description: 'Pedido #12345 foi entregue com sucesso',
        timestamp: new Date(Date.now() - 3600000)
      }
    ]
  } catch (error) {
    console.error('Error loading dashboard data:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadDashboardData()
})
</script>

<style scoped>
.dashboard {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.dashboard-header {
  margin-bottom: 32px;
}

.dashboard-header h1 {
  color: #2c3e50;
  margin-bottom: 8px;
}

.dashboard-header p {
  color: #7f8c8d;
  margin: 0;
}

.dashboard-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  gap: 16px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
}

.stat-content h3 {
  margin: 0 0 4px 0;
  font-size: 1.75rem;
  font-weight: 600;
  color: #2c3e50;
}

.stat-content p {
  margin: 0;
  color: #7f8c8d;
  font-size: 0.9rem;
}

.dashboard-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
  margin-bottom: 32px;
}

.dashboard-section {
  height: fit-content;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-header h2 {
  margin: 0;
  color: #2c3e50;
}

.activity-timeline {
  max-height: 400px;
  overflow-y: auto;
}

.activity-item h4 {
  margin: 0 0 4px 0;
  color: #2c3e50;
}

.activity-item p {
  margin: 0 0 4px 0;
  color: #7f8c8d;
}

.activity-item small {
  color: #95a5a6;
}

.dashboard-actions {
  margin-bottom: 32px;
}

.quick-actions {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .dashboard-content {
    grid-template-columns: 1fr;
  }
  
  .quick-actions {
    flex-direction: column;
  }
  
  .quick-actions .p-button {
    width: 100%;
  }
}
</style>