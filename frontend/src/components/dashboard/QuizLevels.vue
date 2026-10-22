<script setup>
import { ref, onMounted, computed } from "vue";

const loading = ref(false);
const error = ref(null);
const levels = ref([]);
const currentQuestion = ref(null);
const currentQuestionReady = ref(false);
const loggedInUserId = ref(null);

// Hjälpfunktion för att få rätt CSS-klass baserat på miljöns namn
const getBackgroundId = (envName) => {
  const name = envName?.toLowerCase();
  if (name?.includes("skog") || name?.includes("swedish"))
    return "level-background-svensk-skog";
  if (name?.includes("amazonas")) return "level-background-amazonas";
  if (name?.includes("sahara")) return "level-background-sahara";
  return "";
};

//Hämta användarens aktuella nivå baserat på deras senaste fråga. Detta används för att avgöra om en nivå är upplåst, pågående eller avklarad.
const currentLevelId = computed(() => {
  return currentQuestion.value?.current_level_id;
});

// hjälpfunktion för att hämta den aktuella frågan för användaren
const currentQuestionId = computed(() => {
  return currentQuestion.value?.current_question_id;
});

const getLevelStatus = (level, index) => {
  // hämta värdet på den aktuella nivån för användaren
  const userLevelId = currentLevelId.value;

  // Om statistiken inte har laddats klart än, låt nivå 1 vara öppen
  if (!userLevelId) {
    return index === 0 ? "in-progress" : "locked";
  }

  if (level.level_id < userLevelId) {
    return "completed"; // Användaren har klarat denna nivå
  } else if (level.level_id === userLevelId) {
    return "in-progress"; // Användaren är på denna nivå
  } else {
    return "locked"; // Nivån är låst
  }
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

const fetchCurrentQuestionForUser = async (userId) => {

  try {
    const response = await fetch(
      `http://localhost:3000/api/users/${userId}/statistics/current-question`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("user_token")}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    currentQuestion.value = data;
    currentQuestionReady.value = true;
  } catch (err) {
    error.value = err.message;
  }
};

onMounted(() => {
  //Hämta nivåer
  fetchLevels();
  // sätt loggedInUserId baserat på den inloggade användarens ID som lagras i localStorage. Detta används för att hämta den aktuella frågan för användaren i url:en /api/users/:userId/statistics/current-question
  loggedInUserId.value = JSON.parse(localStorage.getItem("user"))?.id;
  //om loggedInUserId finns, skicka med den till fetchCurrentQuestionForUser för att hämta den aktuella frågan för användaren
  if (loggedInUserId.value) {
    fetchCurrentQuestionForUser(loggedInUserId.value);
  } else {
    currentQuestionReady.value = true;
  }
});
</script>

<template>
  <p v-if="loading">Laddar nivåer...</p>
  <p v-if="error" class="error-text">{{ error }}</p>
  <div class="dashboard-quiz-card" v-if="!loading && currentQuestionReady && !error">
    <div
      v-for="(level, index) in levels"
      :key="level.id"
      class="dashboard-level"
      :id="getBackgroundId(level.env_name)"
    >
      <p>{{ level.env_name }}</p>

      <!-- Om nivån är avklarad -->
      <div v-if="getLevelStatus(level, index) === 'completed'">
        <span class="badge-completed">Avklarad</span>
      </div>

      <!-- Om användaren är på denna nivå (Fortsätt quiz) -->
      <router-link
        v-else-if="getLevelStatus(level, index) === 'in-progress'"
        :to="
        currentQuestionId
        ?`/quiz/${level.level_id}/questions?questionId=${currentQuestionId}`
        : `/quiz/${level.level_id}/questions`"
        class="button"
      >
        <!-- Byt text beroende på om man är på början eller mitt i -->
        {{
          currentLevelId > 1 || (currentQuestionId && currentQuestionId > 1)
            ? "Fortsätt quiz"
            : "Starta quiz"
        }}
      </router-link>

      <!-- Om den är låst -->
      <div v-else class="locked-content">
        <span class="lock-icon">🔒</span>
      </div>
    </div>
  </div>
</template>
