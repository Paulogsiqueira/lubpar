<template>
  <div class="prospects-view">
    <div class="page-header">
      <div class="header-content">
        <h1>Prospects</h1>
        <p>Gerencie seus prospects e oportunidades de negócio</p>
      </div>
      <div class="header-actions">
        <Button 
          label="Novo Prospect" 
          icon="pi pi-plus"
          class="p-button-success"
          @click="$router.push('/prospects/new')"
        />
      </div>
    </div>

    <Card class="filter-card">
      <template #content>
        <div class="filters">
          <div class="filter-group">
            <label>Buscar</label>
            <InputText 
              v-model="filters.search"
              placeholder="Nome, empresa, e-mail..."
              @input="debouncedSearch"
            />
          </div>
          
          <div class="filter-group">
            <label>Status</label>
            <Dropdown 
              v-model="filters.status"
              :options="statusOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Todos os status"
              showClear
              @change="applyFilters"
            />
          </div>
          
          <div class="filter-group">
            <label>Segmento</label>
            <Dropdown 
              v-model="filters.segment"
              :options="segmentOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Todos os segmentos"
              showClear
              @change="applyFilters"
            />
          </div>
          
          <div class="filter-group">
            <label>Período</label>
            <Calendar 
              v-model="filters.dateRange"
              selectionMode="range"
              :manualInput="false"
              placeholder="Selecione o período"
              @date-select="applyFilters"
            />
          </div>
          
          <div class="filter-actions">
            <Button 
              label="Limpar" 
              icon="pi pi-times"
              class="p-button-text"
              @click="clearFilters"
            />
          </div>
        </div>
      </template>
    </Card>

    <Card class="data-card">
      <template #content>
        <DataTable 
          :value="prospects" 
          :loading="loading"
          :paginator="true"
          :rows="20"
          :totalRecords="totalRecords"
          :lazy="true"
          @page="onPage"
          @sort="onSort"
          sortMode="multiple"
          responsiveLayout="scroll"
          :selection="selectedProspects"
          @selection-change="onSelectionChange"
          dataKey="id"
        >
          <template #header>
            <div class="table-header">
              <div class="table-title">
                <h3>Lista de Prospects ({{ totalRecords }})</h3>
              </div>
              <div class="table-actions">
                <Button 
                  v-if="selectedProspects.length > 0"
                  :label="`Excluir (${selectedProspects.length})`"
                  icon="pi pi-trash"
                  class="p-button-danger p-button-outlined"
                  @click="confirmDeleteSelected"
                />
                <Button 
                  label="Exportar"
                  icon="pi pi-download"
                  class="p-button-outlined"
                  @click="exportData"
                />
              </div>
            </div>
          </template>

          <Column selectionMode="multiple" headerStyle="width: 3rem" />
          
          <Column field="name" header="Nome" sortable>
            <template #body="{ data }">
              <div class="prospect-name">
                <strong>{{ data.name }}</strong>
                <small>{{ data.email }}</small>
              </div>
            </template>
          </Column>
          
          <Column field="company" header="Empresa" sortable />
          
          <Column field="phone" header="Telefone">
            <template #body="{ data }">
              <a :href="`tel:${data.phone}`" class="phone-link">
                {{ formatPhone(data.phone) }}
              </a>
            </template>
          </Column>
          
          <Column field="segment" header="Segmento" sortable>
            <template #body="{ data }">
              <Tag :value="data.segment" />
            </template>
          </Column>
          
          <Column field="status" header="Status" sortable>
            <template #body="{ data }">
              <Tag 
                :value="data.status" 
                :severity="getStatusSeverity(data.status)"
              />
            </template>
          </Column>
          
          <Column field="lastContact" header="Último Contato" sortable>
            <template #body="{ data }">
              {{ data.lastContact ? formatDate(data.lastContact) : '-' }}
            </template>
          </Column>
          
          <Column field="createdAt" header="Criado em" sortable>
            <template #body="{ data }">
              {{ formatDate(data.createdAt) }}
            </template>
          </Column>
          
          <Column header="Ações" headerStyle="width: 8rem">
            <template #body="{ data }">
              <div class="action-buttons">
                <Button 
                  icon="pi pi-eye"
                  class="p-button-text p-button-sm"
                  @click="viewProspect(data)"
                  v-tooltip="'Visualizar'"
                />
                <Button 
                  icon="pi pi-pencil"
                  class="p-button-text p-button-sm"
                  @click="editProspect(data)"
                  v-tooltip="'Editar'"
                />
                <Button 
                  icon="pi pi-trash"
                  class="p-button-text p-button-sm p-button-danger"
                  @click="confirmDelete(data)"
                  v-tooltip="'Excluir'"
                />
              </div>
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>

    <!-- Prospect Detail Dialog -->
    <Dialog 
      v-model:visible="showDetailDialog"
      :header="selectedProspect?.name"
      :style="{ width: '600px' }"
      :modal="true"
    >
      <ProspectDetail 
        v-if="selectedProspect"
        :prospect="selectedProspect"
        @close="showDetailDialog = false"
      />
    </Dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import { useProspectsStore } from '../../stores/prospects'
import { debounce } from '@vueuse/core'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

import Card from 'primevue/card'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown'
import Calendar from 'primevue/calendar'
import Tag from 'primevue/tag'
import Dialog from 'primevue/dialog'
import ProspectDetail from '../../components/prospects/ProspectDetail.vue'

const router = useRouter()
const toast = useToast()
const confirm = useConfirm()
const prospectsStore = useProspectsStore()

const loading = ref(false)
const prospects = ref([])
const totalRecords = ref(0)
const selectedProspects = ref([])
const selectedProspect = ref(null)
const showDetailDialog = ref(false)

const filters = ref({
  search: '',
  status: '',
  segment: '',
  dateRange: null
})

const statusOptions = ref([
  { label: 'Novo', value: 'novo' },
  { label: 'Em Contato', value: 'contato' },
  { label: 'Proposta Enviada', value: 'proposta' },
  { label: 'Fechado', value: 'fechado' },
  { label: 'Perdido', value: 'perdido' }
])

const segmentOptions = ref([
  { label: 'Automotivo', value: 'automotivo' },
  { label: 'Industrial', value: 'industrial' },
  { label: 'Marítimo', value: 'maritimo' },
  { label: 'Agrícola', value: 'agricola' }
])

const debouncedSearch = debounce(() => {
  applyFilters()
}, 500)

const formatDate = (date) => {
  return format(new Date(date), 'dd/MM/yyyy', { locale: ptBR })
}

const formatPhone = (phone) => {
  return phone?.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3') || ''
}

const getStatusSeverity = (status) => {
  const severityMap = {
    'novo': 'info',
    'contato': 'warning',
    'proposta': 'success',
    'fechado': 'success',
    'perdido': 'danger'
  }
  return severityMap[status] || 'info'
}

const loadProspects = async () => {
  loading.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    prospects.value = [
      {
        id: 1,
        name: 'João Silva',
        email: 'joao@empresa.com',
        company: 'Empresa ABC',
        phone: '11999999999',
        segment: 'automotivo',
        status: 'novo',
        lastContact: new Date(),
        createdAt: new Date()
      },
      {
        id: 2,
        name: 'Maria Santos',
        email: 'maria@xyz.com',
        company: 'Empresa XYZ',
        phone: '11888888888',
        segment: 'industrial',
        status: 'contato',
        lastContact: new Date(Date.now() - 86400000),
        createdAt: new Date(Date.now() - 172800000)
      }
    ]
    
    totalRecords.value = prospects.value.length
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Erro',
      detail: 'Erro ao carregar prospects',
      life: 5000
    })
  } finally {
    loading.value = false
  }
}

const applyFilters = () => {
  prospectsStore.setFilters(filters.value)
  loadProspects()
}

const clearFilters = () => {
  filters.value = {
    search: '',
    status: '',
    segment: '',
    dateRange: null
  }
  prospectsStore.clearFilters()
  loadProspects()
}

const onPage = (event) => {
  // Handle pagination
  loadProspects()
}

const onSort = (event) => {
  // Handle sorting
  loadProspects()
}

const onSelectionChange = (event) => {
  selectedProspects.value = event.value
}

const viewProspect = (prospect) => {
  selectedProspect.value = prospect
  showDetailDialog.value = true
}

const editProspect = (prospect) => {
  router.push(`/prospects/${prospect.id}/edit`)
}

const confirmDelete = (prospect) => {
  confirm.require({
    message: `Tem certeza que deseja excluir o prospect "${prospect.name}"?`,
    header: 'Confirmar Exclusão',
    icon: 'pi pi-exclamation-triangle',
    accept: () => deleteProspect(prospect.id),
    acceptClass: 'p-button-danger'
  })
}

const confirmDeleteSelected = () => {
  confirm.require({
    message: `Tem certeza que deseja excluir ${selectedProspects.value.length} prospects selecionados?`,
    header: 'Confirmar Exclusão',
    icon: 'pi pi-exclamation-triangle',
    accept: () => deleteSelectedProspects(),
    acceptClass: 'p-button-danger'
  })
}

const deleteProspect = async (id) => {
  try {
    await prospectsStore.deleteProspect(id)
    prospects.value = prospects.value.filter(p => p.id !== id)
    totalRecords.value--
    
    toast.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: 'Prospect excluído com sucesso',
      life: 3000
    })
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Erro',
      detail: 'Erro ao excluir prospect',
      life: 5000
    })
  }
}

const deleteSelectedProspects = async () => {
  try {
    const ids = selectedProspects.value.map(p => p.id)
    await Promise.all(ids.map(id => prospectsStore.deleteProspect(id)))
    
    prospects.value = prospects.value.filter(p => !ids.includes(p.id))
    totalRecords.value -= ids.length
    selectedProspects.value = []
    
    toast.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: `${ids.length} prospects excluídos com sucesso`,
      life: 3000
    })
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Erro',
      detail: 'Erro ao excluir prospects',
      life: 5000
    })
  }
}

const exportData = () => {
  // Implement export functionality
  toast.add({
    severity: 'info',
    summary: 'Exportação',
    detail: 'Funcionalidade de exportação em desenvolvimento',
    life: 3000
  })
}

onMounted(() => {
  loadProspects()
})
</script>

<style scoped>
.prospects-view {
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}

.header-content h1 {
  color: #2c3e50;
  margin-bottom: 8px;
}

.header-content p {
  color: #7f8c8d;
  margin: 0;
}

.filter-card {
  margin-bottom: 24px;
}

.filters {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  align-items: end;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-group label {
  font-weight: 500;
  color: #2c3e50;
  font-size: 0.9rem;
}

.filter-actions {
  display: flex;
  align-items: center;
}

.data-card {
  margin-bottom: 24px;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.table-title h3 {
  margin: 0;
  color: #2c3e50;
}

.table-actions {
  display: flex;
  gap: 12px;
}

.prospect-name {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.prospect-name strong {
  color: #2c3e50;
}

.prospect-name small {
  color: #7f8c8d;
}

.phone-link {
  color: #3498db;
  text-decoration: none;
}

.phone-link:hover {
  text-decoration: underline;
}

.action-buttons {
  display: flex;
  gap: 4px;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 16px;
  }
  
  .filters {
    grid-template-columns: 1fr;
  }
  
  .table-header {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }
  
  .table-actions {
    justify-content: stretch;
  }
  
  .table-actions .p-button {
    flex: 1;
  }
}
</style>