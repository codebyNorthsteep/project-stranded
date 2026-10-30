<script setup>
import { useRouter, useRoute } from "vue-router";
import { computed, ref } from "vue";

const router = useRouter();
const route = useRoute();

const logoutError = ref("");

const isDashboard = computed(
  () => route.name === "MyDashboard" || route.path === "/dashboard",
);

const logout = () => {
  logoutError.value = "";
  let tokenRemoved = false;

  try {
    localStorage.removeItem("user_token");
    tokenRemoved = true;
  } catch (error) {
    console.error("Failed to remove user_token:", error);
    logoutError.value = "Logout did not complete. Please try again.";
  }

  try {
    localStorage.removeItem("user");
  } catch (error) {
    console.error("Failed to remove stored user data:", error);
  }

  if (tokenRemoved) {
    return router.push("/");
  }
};
</script>

<template>
  <div v-if="isDashboard || logoutError" class="logout-controls">
    <button v-if="isDashboard" @click="logout" class="button">Logga ut</button>
    <p v-if="isDashboard && logoutError" role="alert" class="error-message">
      {{ logoutError }}
    </p>
  </div>
</template>

<style scoped>
.logout-controls {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.button {
  height: 30px;
  padding: 0 10px;
  margin-right: -10px;
  margin-top: 10px;
  font-family: "Syne Mono", monospace;
}

.error-message {
  color: red;
  font-size: 0.8rem;
}

@media (min-width: 768px) {
  .button {
    height: 35px;
    padding: 0 15px;
    margin-right: 10px;
  }
}
</style>
