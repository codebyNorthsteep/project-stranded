<script setup>
import { computed } from "vue";
import { useRouter,useRoute } from "vue-router";
import Logout from '../components/Logout.vue';


const router = useRouter();
const route = useRoute();

const isQuizpage = computed(() => route.name === "Quiz");

function goHome() {
  if (route.name === "Login" || route.name === "Welcome" || route.name === "Register") {
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
    <header class="main-header">
    <a
    v-if="!isQuizpage"
    <router-link to="/"
    class="clickable-header"
    @click.prevent="goHome"
    >
    <h1>Stranded</h1>
    </a>

    <h1 v-else class="clickable-header">Stranded</h1>

    <Logout />

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

.main-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
h1 {
  margin-top: 20px;
}
</style>


