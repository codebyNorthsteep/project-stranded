<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const form = reactive({
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
});

const formErrors = reactive({
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
});

const isSubmitting = ref(false);
const serverError = ref("");
const successMessage = ref("");

const validateForm = () => {
  let isValid = true;

  formErrors.username = "";
  formErrors.email = "";
  formErrors.password = "";
  formErrors.confirmPassword = "";

  // Username
  if (!form.username.trim()) {
    formErrors.username = "Användarnamn krävs";
    isValid = false;
  } else if (form.username.length < 3) {
    formErrors.username = "Användarnamnet måste vara minst 3 tecken";
    isValid = false;
  }

  // Email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!form.email.trim()) {
    formErrors.email = "E-postadress krävs";
    isValid = false;
  } else if (!emailRegex.test(form.email)) {
    formErrors.email = "Vänligen ange en giltig e-postadress";
    isValid = false;
  }

  // Password
  if (!form.password) {
    formErrors.password = "Lösenord krävs";
    isValid = false;
  } else if (form.password.length < 6) {
    formErrors.password = "Lösenordet måste vara minst 6 tecken";
    isValid = false;
  }

  // Confirm Password
  if (!form.confirmPassword) {
    formErrors.confirmPassword = "Vänligen bekräfta ditt lösenord";
    isValid = false;
  } else if (form.password !== form.confirmPassword) {
    formErrors.confirmPassword = "Lösenorden matchar inte.";
    isValid = false;
  }

  return isValid;
};

const handleRegister = async () => {
  serverError.value = "";
  successMessage.value = "";

  if (!validateForm()) {
    return false;
  }

  isSubmitting.value = true;

  //MOCK DELETE THIS WHEN START WITH BACKEND FOR REGISTER
  setTimeout(() => {
    isSubmitting.value = false;
    successMessage.value =
      "Kontot har skapats! Omdirigerar till inloggningen...";

    setTimeout(() => {
      router.push("/login");
    }, 2000);
  }, 1000);

  /*
  try {
    const response = await fetch(`${apiBaseUrl}/api/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: form.username,
        email: form.email,
        password: form.password}),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || data.message || "Kunde inte skapa konto. Försök igen");
    }

    successMessage.value =
      "Kontot har skapats! Omdirigerar till inloggningen...";

    setTimeout(() => {
      router.push("/login");
    }, 3000);
  } catch (error) {
    serverError.value = error.message || "Kunde inte skapa konto. Försök igen";
  } finally {
    isSubmitting.value = false; 
  }
  */
};
</script>

<template>
  <div class="register-form">
    <form @submit.prevent="handleRegister" novalidate>
      <div class="field">
        <label for="username" class="form-label">Användarnamn</label>
        <input
          id="username"
          v-model="form.username"
          type="text"
          name="username"
          class="form-control"
          required
        />
        <p v-if="formErrors.username" class="error-message">
          {{ formErrors.username }}
        </p>
      </div>

      <div class="field">
        <label for="email" class="form-label">E-postadress</label>
        <input
          id="email"
          v-model="form.email"
          type="email"
          name="email"
          class="form-control"
          required
        />
        <p v-if="formErrors.email" class="error-message">
          {{ formErrors.email }}
        </p>
      </div>

      <div class="field">
        <label for="password" class="form-label">Lösenord</label>
        <input
          id="password"
          v-model="form.password"
          type="password"
          name="password"
          class="form-control"
          required
        />
        <p v-if="formErrors.password" class="error-message">
          {{ formErrors.password }}
        </p>
      </div>

      <div class="field">
        <label for="confirmPassword" class="form-label"
          >Bekräfta lösenord</label
        >
        <input
          id="confirmPassword"
          v-model="form.confirmPassword"
          type="password"
          name="confirmPassword"
          class="form-control"
          required
        />
        <p v-if="formErrors.confirmPassword" class="error-message">
          {{ formErrors.confirmPassword }}
        </p>
      </div>
      <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
      <p v-if="serverError" class="error-message">{{ serverError }}</p>

      <button type="submit" class="button" :disabled="isSubmitting">
        {{ isSubmitting ? "Skapar konto..." : "skapa konto" }}
      </button>
    </form>
  </div>
</template>

<style scoped>
.register-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  width: 100%;
}

form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 20px;
  width: 100%;
  max-width: 220px;
}

.field {
  display: flex;
  flex-direction: column;
  width: 100%;
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
  form {
    width: 100%;
    max-width: 320px;
  }
}

@media (min-width: 1024px) {
  .form-label {
    font-size: 1.3rem;
  }
  form {
    margin-top: 40px;
    width: 100%;
    max-width: 360px;
  }
}
</style>
