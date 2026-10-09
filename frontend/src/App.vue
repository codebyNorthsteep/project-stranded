<script setup>
import Login from "./views/Auth/Login.vue";
import Register from "./views/Auth/Register.vue";
</script>

<template>
  <header>
    <h1>Stranded</h1>
  </header>

  <main class="main-content">
    <RouterView />
  </main>

  <footer>
    <p class="footer-text">© 2026 Stranded. All rights reserved.</p>
    <p>Made with ❤️ by Caroline, Gabriela och Torsten</p>
  </footer>
</template>

<style scoped></style>
