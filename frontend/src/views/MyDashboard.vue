<script setup>
import QuizLevels from "@/components/dashboard/QuizLevels.vue";
import "@/Assets/dashboard.css";
import { ref} from "vue";

const username = ref("Alice"); // ersätt med det faktiska användarnamnet från backend

</script>

<template>
  <div class="dashboard-container">
    <div class="dashboard-welcome">
      <h1>Välkommen, {{ username }}!</h1>
      <p>Här är din dashboard där du kan se din statistik och framsteg.</p>
    </div>

    <QuizLevels />
  </div>
</template>
