<script setup>
import QuizLevels from "@/components/dashboard/QuizLevels.vue";
import DashboardWelcome from "@/components/dashboard/DashboardWelcome.vue";
import StatsShow from "@/components/dashboard/statsShow.vue";
import "@/Assets/dashboard.css";
</script>

<template>
  <div class="dashboard-container">
    <div class="dashboard-main">
      <DashboardWelcome />
      <QuizLevels />
    </div>
    <StatsShow />
  </div>
</template>
