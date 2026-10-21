<script setup>
import { useRouter, useRoute } from "vue-router";
import { computed } from "vue";

const router = useRouter();
const route = useRoute();

const isDashboard = computed(
  () => route.name === "MyDashboard" || route.path === "/dashboard",
);

const logout = () => {
  localStorage.removeItem("user_token");
  localStorage.removeItem("user");

  router.push("/");
};
</script>

<template>
  <button v-if="isDashboard" @click="logout" class="button">Logga ut</button>
</template>

<style scoped>
.button {
  height: 30px;
  padding: 0 10px;
  margin-top: 20px;
  margin-right: -10px;
  font-family: 'Syne Mono', monospace;
}

@media (min-width: 768px) {
  .button {
    height: 35px;
    padding: 0 15px;
    margin-top: 30px;
    margin-right: 10px;
  }
}
</style>
