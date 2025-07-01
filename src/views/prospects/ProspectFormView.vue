<template>
  <div class="prospect-form-view">
    <div class="page-header">
      <div class="header-content">
        <h1>{{ isEditing ? 'Editar Prospect' : 'Novo Prospect' }}</h1>
        <p>{{ isEditing ? 'Atualize as informações do prospect' : 'Cadastre um novo prospect no sistema' }}</p>
      </div>
      <div class="header-actions">
        <Button 
          label="Voltar" 
          icon="pi pi-arrow-left"
          class="p-button-secondary"
          @click="$router.push('/prospects')"
        />
      </div>
    </div>

    <Card class="form-card">
      <template #content>
        <form @submit.prevent="handleSubmit" class="prospect-form">
          <div class="form-section">
            <h3>Informações Pessoais</h3>
            <div class="form-grid">
              <div class="form-group">
                <label for="name">Nome *</label>
                <InputText
                  id="name"
                  v-model="form.name"
                  placeholder="Nome completo"
                  :class="{ 'p-invalid': errors.name }"
                  required
                />
                <small v-if="errors.name" class="p-error">{{ errors.name }}</small>
              </div>

              <div class="form-group">
                <label for="email">E-mail *</label>
                <InputText
                  id="email"
                  v-model="form.email"
                  type="email"
                  placeholder="email@exemplo.com"
                  :class="{ 'p-invalid': errors.email }"
                  required
                />
                <small v-if="errors.email" class="p-error">{{ errors.email }}</small>
              </div>

              <div class="form-group">
                <label for="phone">Telefone *</label>
                <InputText
                  id="phone"
                  v-model="form.phone"
                  placeholder="(11) 99999-9999"
                  :class="{ 'p-invalid': errors.phone }"
                  required
                />
                <small v-if="errors.phone" class="p-error">{{ errors.phone }}</small>
              </div>

              <div class="form-group">
                <label for="company">Empresa *</label>
                <InputText
                  id="company"
                  v-model="form.company"
                  placeholder="Nome da empresa"
                  :class="{ 'p-invalid': errors.company }"
                  required
                />
                <small v-if="errors.company" class="p-error">{{ errors.company }}</small>
              </div>
            </div>
          </div>

          <div class="form-section">
            <h3>Informações Comerciais</h3>
            <div class="form-grid">
              <div class="form-group">
                <label for="segment">Segmento *</label>
                <Dropdown
                  id="segment"
                  v-model="form.segment"
                  :options="segmentOptions"
                  optionLabel="label"
                  optionValue="value"
                  placeholder="Selecione o segmento"
                  :class="{ 'p-invalid': errors.segment }"
                  required
                />
                <small v-if="errors.segment" class="p-error">{{ errors.segment }}</small>
              </div>

              <div class="form-group">
                <label for="status">Status *</label>
                <Dropdown
                  id="status"
                  v-model="form.status"
                  :options="statusOptions"
                  optionLabel="label"
                  optionValue="value"
                  placeholder="Selecione o status"
                  :class="{ 'p-invalid': errors.status }"
                  required
                />
                <small v-if="errors.status" class="p-error">{{ errors.status }}</small>
              </div>

              <div class="form-group">
                <label for="source">Origem</label>
                <Dropdown
                  id="source"
                  v-model="form.source"
                  :options="sourceOptions"
                  optionLabel="label"
                  optionValue="value"
                  placeholder="Como conheceu a empresa?"
                />
              </div>

              <div class="form-group">
                <label for="budget">Orçamento Estimado</label>
                <InputNumber
                  id="budget"
                  v-model="form.budget"
                  mode="currency"
                  currency="BRL"
                  locale="pt-BR"
                  placeholder="R$ 0,00"
                />
              </div>
            </div>
          </div>

          <div class="form-section">
            <h3>Observações</h3>
            <div class="form-group">
              <label for="notes">Notas</label>
              <Textarea
                id="notes"
                v-model="form.notes"
                rows="4"
                placeholder="Observações sobre o prospect..."
              />
            </div>
          </div>

          <div class="form-actions">
            <Button 
              type="button"
              label="Cancelar"
              icon="pi pi-times"
              class="p-button-secondary"
              @click="$router.push('/prospects')"
            />
            <Button 
              type="submit"
              :label="isEditing ? 'Atualizar' : 'Salvar'"
              icon="pi pi-check"
              :loading="loading"
              :disabled="!isFormValid"
            />
          </div>
        </form>
      </template>
    </Card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { useProspectsStore } from '../../stores/prospects'

import Card from 'primevue/card'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Dropdown from 'primevue/dropdown'
import Textarea from 'primevue/textarea'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const prospectsStore = useProspectsStore()

const loading = ref(false)
const isEditing = computed(() => !!route.params.id)

const form = ref({
  name: '',
  email: '',
  phone: '',
  company: '',
  segment: '',
  status: 'novo',
  source: '',
  budget: null,
  notes: ''
})

const errors = ref({})

const segmentOptions = ref([
  { label: 'Automotivo', value: 'automotivo' },
  { label: 'Industrial', value: 'industrial' },
  { label: 'Marítimo', value: 'maritimo' },
  { label: 'Agrícola', value: 'agricola' }
])

const statusOptions = ref([
  { label: 'Novo', value: 'novo' },
  { label: 'Em Contato', value: 'contato' },
  { label: 'Proposta Enviada', value: 'proposta' },
  { label: 'Fechado', value: 'fechado' },
  { label: 'Perdido', value: 'perdido' }
])

const sourceOptions = ref([
  { label: 'Site', value: 'site' },
  { label: 'Indicação', value: 'indicacao' },
  { label: 'Telefone', value: 'telefone' },
  { label: 'E-mail', value: 'email' },
  { label: 'Evento', value: 'evento' },
  { label: 'Outros', value: 'outros' }
])

const isFormValid = computed(() => {
  return form.value.name && 
         form.value.email && 
         form.value.phone && 
         form.value.company && 
         form.value.segment && 
         form.value.status
})

const validateForm = () => {
  errors.value = {}
  
  if (!form.value.name) {
    errors.value.name = 'Nome é obrigatório'
  }
  
  if (!form.value.email) {
    errors.value.email = 'E-mail é obrigatório'
  } else if (!/\S+@\S+\.\S+/.test(form.value.email)) {
    errors.value.email = 'E-mail inválido'
  }
  
  if (!form.value.phone) {
    errors.value.phone = 'Telefone é obrigatório'
  }
  
  if (!form.value.company) {
    errors.value.company = 'Empresa é obrigatória'
  }
  
  if (!form.value.segment) {
    errors.value.segment = 'Segmento é obrigatório'
  }
  
  if (!form.value.status) {
    errors.value.status = 'Status é obrigatório'
  }
  
  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) return
  
  loading.value = true
  
  try {
    if (isEditing.value) {
      await prospectsStore.updateProspect(route.params.id, form.value)
      toast.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Prospect atualizado com sucesso!',
        life: 3000
      })
    } else {
      await prospectsStore.createProspect(form.value)
      toast.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Prospect criado com sucesso!',
        life: 3000
      })
    }
    
    router.push('/prospects')
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Erro',
      detail: error.response?.data?.message || 'Erro ao salvar prospect',
      life: 5000
    })
  } finally {
    loading.value = false
  }
}

const loadProspect = async () => {
  if (!isEditing.value) return
  
  loading.value = true
  try {
    const prospect = await prospectsStore.getProspect(route.params.id)
    form.value = { ...prospect }
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Erro',
      detail: 'Erro ao carregar prospect',
      life: 5000
    })
    router.push('/prospects')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (isEditing.value) {
    loadProspect()
  }
})
</script>

<style scoped>
.prospect-form-view {
  padding: 24px;
  max-width: 1000px;
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

.form-card {
  margin-bottom: 24px;
}

.prospect-form {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-section h3 {
  color: #2c3e50;
  margin: 0;
  padding-bottom: 8px;
  border-bottom: 2px solid #ecf0f1;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 500;
  color: #2c3e50;
  font-size: 0.9rem;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding-top: 16px;
  border-top: 1px solid #ecf0f1;
}

:deep(.p-inputtext),
:deep(.p-dropdown),
:deep(.p-inputnumber-input),
:deep(.p-inputtextarea) {
  width: 100%;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 16px;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .form-actions {
    flex-direction: column-reverse;
  }
  
  .form-actions .p-button {
    width: 100%;
  }
}
</style>