<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const isSubmitting = ref(false);
const errorMessage = ref("");

const form = reactive({
  username: "",
  password: "",
});

async function handleSubmit() {
  errorMessage.value = "";

  // Validate form inputs
if (!form.username && !form.password) {
  errorMessage.value = "Användarnamn och lösenord krävs";
  return;
}
if (!form.username) {
  errorMessage.value = "Användarnamn krävs";
  return;
}
if (!form.password) {
  errorMessage.value = "Lösenord krävs";
  return;
}

  isSubmitting.value = true;

  // Send login request to the backend
  try {
    const response = await fetch("http://localhost:3000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        usernameOrEmail: form.username,
        password: form.password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data.error || "Fel användarnamn eller lösenord");
    }

    //Save the token in localStorage for future authenticated requests
    if (data.token) {
      localStorage.setItem("user_token", data.token);
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }
    }

    // Redirect to the quiz after successful login
    router.push("/quiz");

  } catch (error) {
    errorMessage.value = error.message;
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<template>
  <div class="login-form">
    <form @submit.prevent="handleSubmit" novalidate>
      <div class="field">
        <label for="username" class="form-label"
          >Användarnamn eller e-postadress</label
        >
        <input
          id="username"
          v-model.trim="form.username"
          type="text"
          name="username"
          class="form-control"
          required
        />
      </div>

      <div class="field">
        <label for="password" class="form-label">Lösenord</label>
        <input
          id="password"
          v-model.trim="form.password"
          type="password"
          name="password"
          class="form-control"
          required
        />
      </div>

      <p v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </p>

      <button type="submit" class="button" :disabled="isSubmitting">
        {{ isSubmitting ? "Loggar in..." : "log in" }}
      </button>
    </form>
  </div>
</template>

<style scoped>
.login-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
}

form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 20px;
}

.field {
  display: flex;
  flex-direction: column;
}

.form-label {
  font-size: 0.8rem;
  margin-bottom: 10px;
}

.form-control {
  width: 100%;
  padding: 8px;
  font-size: 0.8rem;
  border-radius: 4px;
  border: 1px solid #ccc;
  box-sizing: border-box;
}

.form-control:focus {
  outline: 1px solid var(--accent-gold);
  border-color: var(--accent-gold);
}

.error-message {
  color: red;
  font-size: 0.8rem;
}

.button {
  margin: 10px 0;
}

@media (min-width: 768px) and (max-width: 1023px) {
  .form-label {
    font-size: 1.15rem;
  }

  .error-message {
    font-size: 1.15rem;
  }
}
@media (min-width: 1024px) {
  .form-label {
    font-size: 1.3rem;
  }
  form {
    margin-top: 40px;
  }
  .error-message {
    font-size: 1.3rem;
  }
}
</style>
