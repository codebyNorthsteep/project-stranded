<script setup>
import "@/Assets/dashboard.css";
import { ref, onMounted, computed } from 'vue'

const username = ref('Alice') // ersätt med det faktiska användarnamnet från backend

const loading = ref(false);
const error = ref(null);
const levels = ref([]);

// Hjälpfunktion för att få rätt CSS-klass baserat på miljöns namn
const getBackgroundClass = (envName) => {
  const name = envName?.toLowerCase();
  if (name?.includes("skog") || name?.includes("swedish"))
    return "level-background-svensk-skog";
  if (name?.includes("amazonas")) return "level-background-amazonas";
  if (name?.includes("sahara")) return "level-background-sahara";
  return "";
};

const fetchLevels = async () => {
  loading.value = true;
  try {
    const response = await fetch("http://localhost:3000/api/levels");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    levels.value = await response.json();
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchLevels();
});
</script>

<template>
  <div class="dashboard-container">
    <div class="dashboard-welcome">
      <h1>Välkommen, {{ username }}!</h1>
      <p>Här är din dashboard där du kan se din statistik och framsteg.</p>
    </div>

    <!-- Visar laddning eller felmeddelande om det behövs -->
    <p v-if="loading">Laddar nivåer...</p>
    <p v-if="error" class="error-text">{{ error }}</p>

    <!-- Quiz Card -->
    <div class="dashboard-quiz-card" v-if="!loading && !error">
      <div class="dashboard-quiz-content">
        <h3>Quiz</h3>
      </div>
      
      <div 
        v-for="level in levels" 
        :key="level.id" 
        class="dashboard-level" 
        :id="getBackgroundClass(level.env_name)"
      >
        <p>{{ level.env_name }}</p>
        <router-link :to="`/quiz/${level.env_name}`" class="button" role="button">
          Starta Quiz   
        </router-link>
      </div>
    </div>
  </div>
</template>
