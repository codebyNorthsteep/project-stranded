<script setup>
import { computed } from "vue";
import { useRouter,useRoute } from "vue-router";
import BurgerMenu from '../components/dashboard/BurgerMenu.vue';


const router = useRouter();
const route = useRoute();

const isQuizpage = computed(() => route.name === "Quiz");
const isDashboardPage = computed(() => route.name === "MyDashboard");

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

    <BurgerMenu v-if="isDashboardPage" />

    <div v-if="route.path.startsWith('/quiz')" class="dashboard-button-container">
    <router-link  
    to="/dashboard" 
    class="button">
    Gå till Dashboard
    </router-link>
    </div>

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
  width: 100%;
  box-sizing: border-box;
}

h1 {
  margin-top: 20px;
}

.dashboard-button-container {
  display: flex;
  align-items: flex-end;
  margin-left: auto;
}

.button {
  height: 35px;
  padding: 0 10px;
  margin-top: 20px;
  font-family: "Syne Mono", monospace;
  color: var(--accent-gold);
  text-align: center;
}

@media (min-width: 768px){
  .button {
    height: 45px;
    padding: 0 20px;
    font-size: 1.2rem;
  }
}
</style>


