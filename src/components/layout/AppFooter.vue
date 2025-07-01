<template>
  <footer class="app-footer">
    <div class="footer-container">
      <div class="footer-content">
        <div class="footer-section">
          <h4>Lubpar Portal</h4>
          <p>Sistema de gestão integrado para otimizar seus processos comerciais.</p>
        </div>
        
        <div class="footer-section">
          <h4>Links Úteis</h4>
          <ul>
            <li><router-link to="/dashboard">Dashboard</router-link></li>
            <li><router-link to="/prospects">Prospects</router-link></li>
            <li><router-link to="/tracking">Rastreamento</router-link></li>
            <li><router-link to="/reports">Relatórios</router-link></li>
          </ul>
        </div>
        
        <div class="footer-section">
          <h4>Suporte</h4>
          <ul>
            <li><a href="mailto:suporte@lubpar.com">suporte@lubpar.com</a></li>
            <li><a href="tel:+5511999999999">(11) 99999-9999</a></li>
          </ul>
        </div>
      </div>
      
      <div class="footer-bottom">
        <p>&copy; {{ currentYear }} Lubpar. Todos os direitos reservados.</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'

const currentYear = computed(() => new Date().getFullYear())
</script>

<style scoped>
.app-footer {
  background: #2c3e50;
  color: white;
  margin-top: auto;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 24px 20px;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 32px;
  margin-bottom: 32px;
}

.footer-section h4 {
  margin-bottom: 16px;
  color: #3498db;
}

.footer-section ul {
  list-style: none;
  padding: 0;
}

.footer-section ul li {
  margin-bottom: 8px;
}

.footer-section a {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: color 0.2s ease;
}

.footer-section a:hover {
  color: #3498db;
}

.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 20px;
  text-align: center;
  color: rgba(255, 255, 255, 0.6);
}
</style>