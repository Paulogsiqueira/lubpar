<template>
  <div class="prospect-detail">
    <div class="detail-section">
      <h3>Informações Pessoais</h3>
      <div class="detail-grid">
        <div class="detail-item">
          <label>Nome:</label>
          <span>{{ prospect.name }}</span>
        </div>
        <div class="detail-item">
          <label>E-mail:</label>
          <span>{{ prospect.email }}</span>
        </div>
        <div class="detail-item">
          <label>Telefone:</label>
          <span>{{ formatPhone(prospect.phone) }}</span>
        </div>
        <div class="detail-item">
          <label>Empresa:</label>
          <span>{{ prospect.company }}</span>
        </div>
      </div>
    </div>

    <div class="detail-section">
      <h3>Informações Comerciais</h3>
      <div class="detail-grid">
        <div class="detail-item">
          <label>Segmento:</label>
          <Tag :value="prospect.segment" />
        </div>
        <div class="detail-item">
          <label>Status:</label>
          <Tag 
            :value="prospect.status" 
            :severity="getStatusSeverity(prospect.status)"
          />
        </div>
        <div class="detail-item">
          <label>Último Contato:</label>
          <span>{{ prospect.lastContact ? formatDate(prospect.lastContact) : '-' }}</span>
        </div>
        <div class="detail-item">
          <label>Criado em:</label>
          <span>{{ formatDate(prospect.createdAt) }}</span>
        </div>
      </div>
    </div>

    <div class="detail-actions">
      <Button 
        label="Editar"
        icon="pi pi-pencil"
        @click="editProspect"
      />
      <Button 
        label="Fechar"
        icon="pi pi-times"
        class="p-button-secondary"
        @click="$emit('close')"
      />
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import Button from 'primevue/button'
import Tag from 'primevue/tag'

const props = defineProps({
  prospect: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close'])

const router = useRouter()

const formatDate = (date) => {
  return format(new Date(date), 'dd/MM/yyyy HH:mm', { locale: ptBR })
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

const editProspect = () => {
  router.push(`/prospects/${props.prospect.id}/edit`)
  emit('close')
}
</script>

<style scoped>
.prospect-detail {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.detail-section h3 {
  color: #2c3e50;
  margin-bottom: 16px;
  border-bottom: 2px solid #ecf0f1;
  padding-bottom: 8px;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-item label {
  font-weight: 500;
  color: #7f8c8d;
  font-size: 0.9rem;
}

.detail-item span {
  color: #2c3e50;
}

.detail-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding-top: 16px;
  border-top: 1px solid #ecf0f1;
}
</style>