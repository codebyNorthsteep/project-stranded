<script setup>
import { ref, onMounted, computed } from "vue";
const loading = ref(false);
const error = ref(null);
const questions = ref([]);
const currentIndex = ref(0);

const currentQuestion = computed(() => questions.value[currentIndex.value]);
const isLast = computed(
  () => currentIndex.value === questions.value.length - 1,
);

const nextQuestion = () => {
  if (!isLast.value) currentIndex.value++;
};

const fetchQuestions = async () => {
  loading.value = true;
  try {
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

onMounted(() => {
  fetchQuestions();
});
</script>

<template>
  <div class="quiz-container">
    <p v-if="loading">Laddar...</p>
    <p v-if="error">Fel: {{ error }}</p>

    <div v-if="currentQuestion">
      <div class="question">
        <p>{{ currentQuestion.level_id }}</p>
        <p>Fråga {{ currentIndex + 1 }} / {{ questions.length }}</p>

        <img
          v-if="currentQuestion.question_img"
          :src="currentQuestion.question_img"
          alt="Frågebild"
          width="150"
        />
        <h2>{{ currentQuestion.question_title }}</h2>
        <h3>{{ currentQuestion.question_text }}</h3>
      </div>
      <div class="answers">
        <ul>
          <li v-for="answer in currentQuestion.answers" :key="answer.answer_id">
            <img
              v-if="answer.answer_img"
              :src="answer.answer_img"
              alt="Svarsalternativ"
              width="150"
            />
            <button>
              {{ answer.answer_text }}
            </button>
          </li>
        </ul>
      </div>

      <button @click="nextQuestion" :disabled="isLast">Nästa</button>
      <p v-if="isLast">Det var sista frågan!</p>
    </div>
  </div>
</template>

<style scoped>
.quiz-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
}

ul {
  list-style-type: none; /* Tar bort punktlistans prickar */
  padding: 0; /* Tar bort standardindraget till vänster */
  margin: 0; /* Tar bort standardmarginaler */
}

.question {
  margin-bottom: 20px;
  padding: 10px;
  
}
.answers {
  margin-bottom: 20px;
}

button {
  margin-top: 10px;
  padding: 10px 20px;
  cursor: pointer;
}
</style>
