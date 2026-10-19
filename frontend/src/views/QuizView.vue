<script setup>
import "@/Assets/quiz.css";

import { ref, onMounted, computed } from "vue";
const loading = ref(false);
const error = ref(null);
const questions = ref([]);
const currentIndex = ref(0);

<<<<<<< HEAD
=======
const selectedAnswerId = ref(null);
const validatedAnswer = ref(null);

>>>>>>> a559643d2600fd1ebb596f0be77d38ccc683acbf
const letters = ["A", "B", "C"];

//Ändra bakgrundsbild beroende på level_name
const getBackgroundId = computed(() => {
<<<<<<< HEAD
if (!currentQuestion.value) return '';

const name = currentQuestion.value.level_name?.toLowerCase();
  if (name?.includes('skog') || name?.includes('swedish')) return 'level-background-svensk-skog';
  if (name?.includes('amazonas')) return 'level-background-amazonas';
  if (name?.includes('sahara')) return 'level-background-sahara';
  return '';
=======
  if (!currentQuestion.value) return "";

  const name = currentQuestion.value.level_name?.toLowerCase();
  if (name?.includes("skog") || name?.includes("swedish"))
    return "level-background-svensk-skog";
  if (name?.includes("amazonas")) return "level-background-amazonas";
  if (name?.includes("sahara")) return "level-background-sahara";
  return "";
>>>>>>> a559643d2600fd1ebb596f0be77d38ccc683acbf
});

const currentQuestion = computed(() => questions.value[currentIndex.value]);
const isLast = computed(
  () => currentIndex.value === questions.value.length - 1,
);

const nextQuestion = () => {
<<<<<<< HEAD
  if (!isLast.value) currentIndex.value++;
=======
  if (!isLast.value) {
    currentIndex.value++;
      validatedAnswer.value = null;
  selectedAnswerId.value = null;
  }

>>>>>>> a559643d2600fd1ebb596f0be77d38ccc683acbf
};

const fetchQuestions = async () => {
  loading.value = true;
  try {
<<<<<<< HEAD
    // Hämta frågorna från API:et, denna kommer vara dynamisk med ${levelId} när vi implementerar 
    //av att hämta levelId från URL:en baserat på när man klarat en level och går vidare till nästa (ref[])
=======
>>>>>>> a559643d2600fd1ebb596f0be77d38ccc683acbf
    const response = await fetch(
      "http://localhost:3000/api/levels/1/questions",
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    questions.value = await response.json();
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

<<<<<<< HEAD
=======
const fetchAnswerValidation = async (answerId) => {
  selectedAnswerId.value = answerId;

  try {
    const response = await fetch(
      `http://localhost:3000/api/answers/${answerId}/validate`,
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();

    if (selectedAnswerId.value === answerId) {
      validatedAnswer.value = result;
    }
  } catch (err) {
    error.value = err.message;
  }
};

>>>>>>> a559643d2600fd1ebb596f0be77d38ccc683acbf
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
<<<<<<< HEAD
          <p class="level-badge">
          Nivå:  {{ currentQuestion.level_name }}
          </p>
          <span class="counter-text">
           Fråga {{ currentIndex + 1 }}/{{ questions.length }}
=======
          <p class="level-badge">Nivå: {{ currentQuestion.level_name }}</p>
          <span class="counter-text">
            Fråga {{ currentIndex + 1 }}/{{ questions.length }}
>>>>>>> a559643d2600fd1ebb596f0be77d38ccc683acbf
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
<<<<<<< HEAD
            <button class="button">
              <span class="letter">{{ letters[i] }}</span>
=======
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

>>>>>>> a559643d2600fd1ebb596f0be77d38ccc683acbf
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

<<<<<<< HEAD
      <!-- Tillfällig nästa-knapp för testning -->
      <!-- Denna tas bort när vi implementerar pop up-fönstren för rätt/fel svar -->
      <div class="temp-nav">
        <button @click="nextQuestion" :disabled="isLast" class="next-btn">
          Nästa
        </button>
        <p v-if="isLast" class="last-msg">Det var sista frågan!</p>
=======
      <div class="next-question" v-if="validatedAnswer && validatedAnswer.is_correct">
        <div class="correct-msg">Korrekt svar!</div>
        <button v-if="!isLast" @click="nextQuestion" class="button">Nästa fråga</button>
>>>>>>> a559643d2600fd1ebb596f0be77d38ccc683acbf
      </div>
    </div>
  </div>
</template>
