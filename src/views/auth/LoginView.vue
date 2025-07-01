<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <img src="/logo.png" alt="Lubpar" class="login-logo" />
        <h1>Lubpar Portal</h1>
        <p>Faça login para acessar o sistema</p>
      </div>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="email">E-mail</label>
          <InputText
            id="email"
            v-model="form.email"
            type="email"
            placeholder="Digite seu e-mail"
            :class="{ 'p-invalid': errors.email }"
            required
          />
          <small v-if="errors.email" class="p-error">{{ errors.email }}</small>
        </div>

        <div class="form-group">
          <label for="password">Senha</label>
          <Password
            id="password"
            v-model="form.password"
            placeholder="Digite sua senha"
            :feedback="false"
            toggleMask
            :class="{ 'p-invalid': errors.password }"
            required
          />
          <small v-if="errors.password" class="p-error">{{ errors.password }}</small>
        </div>

        <div class="form-group">
          <div class="form-check">
            <Checkbox
              id="remember"
              v-model="form.remember"
              :binary="true"
            />
            <label for="remember">Lembrar-me</label>
          </div>
        </div>

        <Button
          type="submit"
          label="Entrar"
          class="login-button"
          :loading="authStore.loading"
          :disabled="!isFormValid"
        />

        <div class="login-links">
          <a href="#" @click.prevent="showForgotPassword">Esqueci minha senha</a>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { useAuthStore } from '../../stores/auth'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import Checkbox from 'primevue/checkbox'

const router = useRouter()
const toast = useToast()
const authStore = useAuthStore()

const form = ref({
  email: '',
  password: '',
  remember: false
})

const errors = ref({})

const isFormValid = computed(() => {
  return form.value.email && form.value.password
})

const validateForm = () => {
  errors.value = {}
  
  if (!form.value.email) {
    errors.value.email = 'E-mail é obrigatório'
  } else if (!/\S+@\S+\.\S+/.test(form.value.email)) {
    errors.value.email = 'E-mail inválido'
  }
  
  if (!form.value.password) {
    errors.value.password = 'Senha é obrigatória'
  } else if (form.value.password.length < 6) {
    errors.value.password = 'Senha deve ter pelo menos 6 caracteres'
  }
  
  return Object.keys(errors.value).length === 0
}

const handleLogin = async () => {
  if (!validateForm()) return
  
  try {
    await authStore.login({
      email: form.value.email,
      password: form.value.password,
      remember: form.value.remember
    })
    
    toast.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: 'Login realizado com sucesso!',
      life: 3000
    })
    
    router.push('/dashboard')
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Erro',
      detail: error.response?.data?.message || 'Erro ao fazer login',
      life: 5000
    })
  }
}

const showForgotPassword = () => {
  toast.add({
    severity: 'info',
    summary: 'Recuperação de Senha',
    detail: 'Entre em contato com o administrador do sistema',
    life: 5000
  })
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  padding: 48px;
  width: 100%;
  max-width: 400px;
}

.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.login-logo {
  height: 60px;
  margin-bottom: 16px;
}

.login-header h1 {
  color: #2c3e50;
  margin-bottom: 8px;
  font-size: 1.75rem;
  font-weight: 600;
}

.login-header p {
  color: #7f8c8d;
  margin: 0;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 500;
  color: #2c3e50;
}

.form-check {
  display: flex;
  align-items: center;
  gap: 8px;
}

.form-check label {
  margin: 0;
  cursor: pointer;
}

.login-button {
  width: 100%;
  padding: 12px;
  font-size: 1rem;
  font-weight: 500;
}

.login-links {
  text-align: center;
}

.login-links a {
  color: #3498db;
  text-decoration: none;
  font-size: 0.9rem;
}

.login-links a:hover {
  text-decoration: underline;
}

:deep(.p-inputtext),
:deep(.p-password input) {
  width: 100%;
  padding: 12px;
  border-radius: 8px;
}

:deep(.p-password) {
  width: 100%;
}
</style>