<script setup>
import "@/Assets/quiz.css";
import { useRoute, useRouter } from "vue-router";
import { ref, onMounted, computed, watch } from "vue";
import LevelCompleted from "@/components/LevelCompleted.vue";
import QuizCompleted from "@/components/QuizCompleted.vue";

const route = useRoute();
const router = useRouter(); //Hämta router-instansen för att kunna navigera till nästa level efter att man har klarat alla frågor i en nivå

const loading = ref(false);
const error = ref(null);
const questions = ref([]);
const currentIndex = ref(0);
const levels = ref([]);

const selectedAnswerId = ref(null);
const validatedAnswer = ref(null);
const isLevelCompleted = ref(false);
const isQuizCompleted = ref(false);

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
    //If it's last question,
    //We have to check if it's the last question of the last level, in that case, we show the component quiz completed
    if (isLastLevelOfQuiz.value) {
      isQuizCompleted.value = true;
      //Otherwise, it's the last question of another level so we show the component level completed instead
    } else {
      isLevelCompleted.value = true;
    }
  }
};

const nextLevel = () => {
  isLevelCompleted.value = false;
  const currentLevelId = Number(route.params.levelId);
  const currentIndex = levels.value.findIndex(
    (l) => l.level_id === currentLevelId,
  );

  if (currentIndex !== -1 && currentIndex < levels.value.length - 1) {
    const nextLevelId = levels.value[currentIndex + 1].level_id;
    router.push(`/quiz/${nextLevelId}/questions`);
  }
};

//We need to handle first level in case the user press on the button "start quiz from first level" on quiz completed
const firstLevel = () => {
  if (levels.value.length === 0) return;

  const firstLevelId = levels.value[0].level_id;

  //If the first level is, ath the same time, the last level, we need to restart all the variables
  if (Number(route.params.levelId) === Number(firstLevelId)) {
    validatedAnswer.value = null;
    selectedAnswerId.value = null;
    currentIndex.value = 0;
    questions.value = [];
    isLevelCompleted.value = false;
    isQuizCompleted.value = false;
    fetchQuestions(firstLevelId);
  } else {
    isQuizCompleted.value = false;
    router.push(`/quiz/${firstLevelId}/questions`);
  }
};

//Determinate if the current level is the last level
const isLastLevelOfQuiz = computed(() => {
  if (levels.value.length === 0) {
    return false;
  }
  const currentLevelId = Number(route.params.levelId);
  const lastLevel = levels.value[levels.value.length - 1];
  return currentLevelId === lastLevel.level_id;
});

const levelsLoading = ref(true);
const levelsError = ref(null);

const levelsReady = computed(
  () => !levelsLoading.value && !levelsError.value && levels.value.length > 0,
);

const fetchLevels = async () => {
  levelsLoading.value = true;
  levelsError.value = null;

  try {
    const response = await fetch("http://localhost:3000/api/levels");

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!Array.isArray(data) || data.length === 0) {
      throw new Error("Inga nivåer kunde laddas.");
    }

    levels.value = data;
  } catch (err) {
    levelsError.value = err.message;
  } finally {
    levelsLoading.value = false;
  }
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
        if (isLastLevelOfQuiz.value) {
          isQuizCompleted.value = true;
        } else {
          isLevelCompleted.value = true;
        }
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
      isLevelCompleted.value = false;
      isQuizCompleted.value = false;
      fetchQuestions(newLevelId); // Hämta nya frågor för den nya nivån
    }
  },
);

onMounted(() => {
  fetchLevels();
  fetchQuestions();
});
</script>

<template>
  <div class="quiz-container" :id="getBackgroundId">
    <p v-if="loading || levelsLoading" class="status-msg">Laddar...</p>

    <p v-if="error" class="status-msg error">Fel: {{ error }}</p>

    <div v-if="levelsError" role="alert">
      <p class="status-msg error">
        Kunde inte ladda nivåerna: {{ levelsError }}
      </p>
      <button class="button" @click="fetchLevels">Försök igen</button>
    </div>

    <div v-if="currentQuestion && levelsReady" class="quiz-content">
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

      <div
        class="next-question"
        v-if="validatedAnswer && validatedAnswer.is_correct"
      >
        <div class="correct-msg">Korrekt svar!</div>
        <button v-if="!isLast" @click="nextQuestion" class="button">
          Nästa fråga
        </button>
        <button v-else @click="nextQuestion" class="button">
          {{ isLastLevelOfQuiz ? "Se resultat" : "Nästa nivå" }}
        </button>
      </div>
    </div>

    <LevelCompleted v-if="isLevelCompleted" @next-level="nextLevel" />
    <QuizCompleted v-if="isQuizCompleted" @first-level="firstLevel" />
  </div>
</template>
