<script setup>
import { computed } from "vue";
import { useRouter,useRoute } from "vue-router";


const router = useRouter();
const route = useRoute();

const isQuizpage = computed(() => route.name === "Quiz");

function goHome() {
  if (route.name === "Login" || route.name === "Register") {
    router.push({ name: "Welcome" });
    return;
  }

  const destination = localStorage.getItem("user_token")
    ? { name: "MyDashboard" }
    : { name: "Welcome" };

  router.push(destination);
}
</script>

<template>
    <header>
    <a
    v-if="!isQuizpage"
    href="/"
    class="clickable-header"
    @click.prevent="goHome"
    >
    <h1>Stranded</h1>
    </a>

    <h1 v-else class="clickable-header">Stranded</h1>
    </header>
</template>

<style scoped>
.clickable-header {
  display: inline-block;
  color: var(--accent-gold);
  text-decoration: none;
}

.clickable-header:focus-visible {
  outline: 2px solid var(--accent-gold);
  outline-offset: 4px;
}
h1 {
  margin-top: 20px;
}
</style>


