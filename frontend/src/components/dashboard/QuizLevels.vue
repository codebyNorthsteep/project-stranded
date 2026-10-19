<script setup>
import { ref, onMounted } from "vue";

const loading = ref(false);
const error = ref(null);
const levels = ref([]);

// Hjälpfunktion för att få rätt CSS-klass baserat på miljöns namn
const getBackgroundId = (envName) => {
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
  <p v-if="loading">Laddar nivåer...</p>
  <p v-if="error" class="error-text">{{ error }}</p>
  <div class="dashboard-quiz-card" v-if="!loading && !error">
    <div
      v-for="(level, index) in levels"
      :key="level.id"
      class="dashboard-level"
      :id="getBackgroundId(level.env_name)"
    >
      <p>{{ level.env_name }}</p>
      <!-- Visa "Starta quiz"-knappen på nivå 1 och nivåer som är upplåsta 
       Todo: visa en progressbar
       todo: visa fortsätt quiz om man har ett pågående quiz -->
      <router-link
        v-if="index === 0 || level.unlocked"
        :to="`/quiz/${level.level_id}/questions`"
        class="button"
        role="button"
      >
        Starta quiz
      </router-link>

      <!-- Annars visas hänglåset -->
      <div v-else class="locked-content">
        <span class="lock-icon" role="img" aria-label="Låst nivå">🔒</span>
      </div>
    </div>
  </div>
</template>
