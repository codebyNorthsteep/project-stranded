<script setup>
import QuizLevels from "@/components/dashboard/QuizLevels.vue";
import DashboardWelcome from "@/components/dashboard/DashboardWelcome.vue";
import "@/Assets/dashboard.css";
import { ref } from "vue";

</script>

<template>
  <div class="dashboard-container">
    <DashboardWelcome />
    <QuizLevels />
  </div>
</template>
