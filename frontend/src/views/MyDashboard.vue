<script setup>
import QuizLevels from "@/components/dashboard/QuizLevels.vue";
<<<<<<< HEAD
import RightAnswers from "@/components/dashboard/RightAnswers.vue";
import "@/Assets/dashboard.css";
import { ref } from "vue";

const username = ref("Alice"); // ersätt med det faktiska användarnamnet från backend
=======
import DashboardWelcome from "@/components/dashboard/DashboardWelcome.vue";
import "@/Assets/dashboard.css";
import { ref } from "vue";
>>>>>>> main

</script>

<template>
  <div class="dashboard-container">
<<<<<<< HEAD
    <div class="dashboard-welcome">
      <h1>Välkommen, {{ username }}!</h1>
      <p>Här är din dashboard där du kan se din statistik och framsteg.</p>
    </div>

    <div class="dashboard-content-row">
      <QuizLevels />
      <RightAnswers />
    </div>
=======
    <DashboardWelcome />
    <QuizLevels />
>>>>>>> main
  </div>
</template>

<style scoped>
.dashboard-content-row {
  display: flex;
  align-items: stretch;
  justify-content: center;
  gap: 20px;
  width: 100%;
}

@media (max-width: 767px) {
  .dashboard-content-row {
    flex-direction: column;
    align-items: center;
  }
}
</style>
