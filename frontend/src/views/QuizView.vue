<script setup>
import "@/Assets/quiz.css";
import { useRoute, useRouter } from "vue-router";

import { ref, onMounted, computed, watch } from "vue";
const route = useRoute();
const router = useRouter(); //Hämta router-instansen för att kunna navigera till nästa level efter att man har klarat alla frågor i en nivå
import LevelCompleted from '@/components/LevelCompleted.vue'

const loading = ref(false);
const error = ref(null);
const questions = ref([]);
const currentIndex = ref(0);

const selectedAnswerId = ref(null);
const validatedAnswer = ref(null);
const isLevelCompleted = ref(true);

const letters = ["A", "B", "C"];

//Ändra bakgrundsbild beroende på level_name
const getBackgroundId = computed(() => {
  if (!currentQuestion.value) return "";

  const name = currentQuestion.value.level_name?.toLowerCase();
  if (name?.includes("skog") || name?.includes("swedish"))
    return "level-background-svensk-skog";
  if (name?.includes("amazonas")) return "level-background-amazonas";
  if (name?.includes("sahara")) return "level-background-sahara";
  return "";
});

const currentQuestion = computed(() => questions.value[currentIndex.value]);
const isLast = computed(
  () => currentIndex.value === questions.value.length - 1,
);

const nextQuestion = () => {
  if (!isLast.value) {
    currentIndex.value++;
      validatedAnswer.value = null;
  selectedAnswerId.value = null;
  } else {
    //todo: visa en popup-ruta som säger att man har klarat alla frågor i en nivå och navigera till nästa level eller dashboard
    nextLevel(); // Navigera till nästa level efter att man har klarat alla frågor i en nivå
  }

};

const handleNextLevel = () => {
  isLevelCompleted.value = false;
  currentIndex.value = 0;
  validatedAnswer.value = null;
  selectedAnswerId.value = null;
  
  fetchQuestions();
};

const fetchQuestions = async (requestedLevelId = route.params.levelId) => {
  loading.value = true;
error.value = null;
// Kontrollera att vi fortfarande är på samma nivå som när vi började hämta frågorna så att vi inte uppdaterar state med fel data om användaren navigerar bort innan fetchen är klar
const isCurrentRequestedLevel = () =>
String(route.params.levelId) === String(requestedLevelId);
  try {
    const response = await fetch(
      `http://localhost:3000/api/levels/${requestedLevelId}/questions`,
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    // Blanda svarsalternativen en gång per fråga när de laddas in
    if (isCurrentRequestedLevel()) {
      questions.value = data.map((q) => ({
        ...q,
        answers: [...q.answers].sort(() => Math.random() - 0.5),
      }));
    }
  } catch (err) {
    if (isCurrentRequestedLevel()) error.value = err.message;
  } finally {
    if (isCurrentRequestedLevel()) loading.value = false;
  }
};

const nextLevel = () => {
  // Navigera till nästa level efter att man har klarat alla frågor i en nivå
  const currentLevelId = parseInt(route.params.levelId);
  const nextLevelId = currentLevelId + 1;
  router.push(`/quiz/${nextLevelId}/questions`);
};

const fetchAnswerValidation = async (answerId) => {
  selectedAnswerId.value = answerId;
  const validationLevelId = route.params.levelId; // Spara nuvarande nivå när anropet startar för att säkerställa att vi inte uppdaterar state med fel data om användaren navigerar bort innan fetchen är klar

  try {
    const response = await fetch(
      `http://localhost:3000/api/answers/${answerId}/validate`,
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();

    // Kontrollera att vi är kvar på samma nivå och att samma svar fortfarande är aktivt
    if (
      String(route.params.levelId) === String(validationLevelId) &&
      selectedAnswerId.value === answerId
    ) {
      validatedAnswer.value = result;

      if (result.is_correct && isLast.value) {
        isLevelCompleted.value = true;
      }
    }
  } catch (err) {
    // Samma säkerhetskoll i catch-blocket så vi inte sätter felmeddelande på fel nivå
    if (
      String(route.params.levelId) === String(validationLevelId) &&
      selectedAnswerId.value === answerId
    ) {
      error.value = err.message;
    }
  }
};

// Lyssna på om URL:en ändras (i detta fallnär man byter nivå)
watch(
  () => route.params.levelId,
  (newLevelId) => {
    if (newLevelId) {
      validatedAnswer.value = null;
      selectedAnswerId.value = null;
      currentIndex.value = 0;
      questions.value = [];
      fetchQuestions(newLevelId); // Hämta nya frågor för den nya nivån
    }
  }
);

onMounted(() => {
  fetchQuestions();
});
</script>

<template>
  <div class="quiz-container" :id="getBackgroundId">
    <p v-if="loading" class="status-msg">Laddar...</p>
    <p v-if="error" class="status-msg error">Fel: {{ error }}</p>

    <div v-if="currentQuestion" class="quiz-content">
      <div class="quiz-header">
        <div class="level-info">
          <p class="level-badge">Nivå: {{ currentQuestion.level_name }}</p>
          <span class="counter-text">
            Fråga {{ currentIndex + 1 }}/{{ questions.length }}
          </span>
        </div>
        <progress :value="currentIndex + 1" :max="questions.length"></progress>
      </div>

      <!-- Frågeruta -->
      <div class="question-card">
        <p class="question-subtitle">{{ currentQuestion.question_title }}</p>
        <h2 class="question-text">{{ currentQuestion.question_text }}</h2>
        <img
          v-if="currentQuestion.question_img"
          :src="currentQuestion.question_img"
          alt="Frågebild"
          class="question-img"
        />
      </div>

      <!-- Svarsalternativ -->
      <div class="answers">
        <ul>
          <li
            v-for="(answer, i) in currentQuestion.answers"
            :key="answer.answer_id"
          >
          <!-- Eftersom att vi vid fel svar kommer visa att det är fel via en popup-ruta, 
           så finns det just nu endast logik för svar som är korrekta -->
            <button
              class="button"
              :class="{
                'correct-answer':
                  validatedAnswer &&
                  answer.answer_id === selectedAnswerId &&
                  validatedAnswer.is_correct,
                'dimmed-answer':
                  validatedAnswer && answer.answer_id !== selectedAnswerId,
              }"
              @click="fetchAnswerValidation(answer.answer_id)"
              :disabled="validatedAnswer"
            >
              <span class="letter">
                <span
                  v-if="
                    validatedAnswer &&
                    answer.answer_id === selectedAnswerId &&
                    validatedAnswer.is_correct
                  "
                  >✔</span
                >
                <span v-else>{{ letters[i] }}</span>
              </span>

              <div class="answer-content">
                <span class="answer-text">{{ answer.answer_text }}</span>
                <img
                  v-if="answer.answer_img"
                  :src="answer.answer_img"
                  alt="Svarsalternativ"
                  class="answer-img"
                />
              </div>
            </button>
          </li>
        </ul>
      </div>

      <div class="next-question" v-if="validatedAnswer && validatedAnswer.is_correct">
        <div class="correct-msg">Korrekt svar!</div>
        <button v-if="!isLast" @click="nextQuestion" class="button">Nästa fråga</button>
        <button v-else @click="nextLevel" class="button">Nästa nivå</button>
      </div>
    </div>

    <LevelCompleted
      v-if="isLevelCompleted"
      @next-level="handleNextLevel"
    />
  </div>
</template>
