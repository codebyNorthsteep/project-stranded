<script setup>
import Login from "./views/Auth/Login.vue";
import Register from "./views/Auth/Register.vue";
</script>

<template>
  <header>
    <h1 class="title">Stranded</h1>
  </header>

  <main class="main-content">
    <RouterView />
  </main>
</template>

<style scoped></style>
