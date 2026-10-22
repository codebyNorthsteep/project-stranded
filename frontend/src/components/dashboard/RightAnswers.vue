<script setup>
import { onMounted, ref } from "vue";

const correctAnswers = ref(null);
const error = ref("");

onMounted(async () => {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!user?.id) {
    error.value = "Kunde inte hitta användar-ID.";
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:3000/api/statistics/${user.id}/correct-answers`,
    );

    if (!response.ok) {
      throw new Error(`Kunde inte hämta statistik (${response.status}).`);
    }

    const data = await response.json();
    correctAnswers.value = data.correct_questions;
  } catch (err) {
    error.value = err.message;
  }
});
</script>

<template>
  <section class="right-answers-card">
    <h2>Rätta svar</h2>
    <p v-if="error">{{ error }}</p>
    <p v-else-if="correctAnswers === null">Hämtar statistik...</p>
    <strong v-else>{{ correctAnswers }} rätt</strong>
  </section>
</template>

<style scoped>
.right-answers-card {
  box-sizing: border-box;
  width: 220px;
  min-height: 240px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  color: var(--text-light);
}

.right-answers-card h2 {
  margin: 0 0 16px;
  color: var(--accent-gold);
}

.right-answers-card strong {
  color: var(--accent-gold);
  font-size: 2rem;
}
</style>