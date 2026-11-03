<script setup>
import UseAmbienceMusic from "@/components/UseAmbienceMusic.vue";
import QuizLevels from "@/components/dashboard/QuizLevels.vue";
import DashboardWelcome from "@/components/dashboard/DashboardWelcome.vue";
import "@/Assets/dashboard.css";
import { ref } from "vue";

</script>

<template>
  <div class="dashboard-container">
    <UseAmbienceMusic  src="/ambience/bonfire.mp3"/>
    <DashboardWelcome />
    <QuizLevels />
  </div>
</template>
