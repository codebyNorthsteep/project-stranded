<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const formData = reactive({
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

const serverError = ref("");

const validateForm = () => {
  let isValid = true;

  formErrors.username = "";
  formErrors.email = "";
  formErrors.password = "";
  formErrors.confirmPassword = "";

  // Username
  if (!formData.username.trim()) {
    formErrors.username = "Username is required.";
    isValid = false;
  } else if (formData.username.length < 3) {
    formErrors.username = "Username must be at least 3 characters.";
    isValid = false;
  }

  // Email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!formData.email.trim()) {
    formErrors.email = "Email is required.";
    isValid = false;
  } else if (!emailRegex.test(formData.email)) {
    formErrors.email = "Please enter a valid email.";
    isValid = false;
  }

  // Password
  if (!formData.password) {
    formErrors.password = "Password is required.";
    isValid = false;
  } else if (formData.password.length < 6) {
    formErrors.password = "Password must be at least 6 characters.";
    isValid = false;
  }

  // Confirm Password
  if (!formData.confirmPassword) {
    formErrors.confirmPassword = "Please confirm your password.";
    isValid = false;
  } else if (formData.password !== formData.confirmPassword) {
    formErrors.confirmPassword = "Passwords do not match.";
    isValid = false;
  }

  return isValid;
};

const successMessage = ref("");

const handleRegister = async () => {
  if (!validateForm()) {
    return false;
  }

  try {
    console.log("Sending data to backend:", formData);

    // AQUÍ CONECTARÁS CON TU BACKEND NODE.JS
    /*
    const response = await fetch('http://localhost:3000/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
    */

    successMessage.value = "Account created successfully! Redirecting to login...";

    setTimeout(() => {
      router.push("/login");
    }, 3000);

  } catch (error) {
    serverError.value = "Failed to create account. Try again.";
  }
};
</script>

<template>
  <header>
    <p>Create Account</p>
    <p>Join the survival arena and test your wits</p>
  </header>

  <section class="register-section">
    <form @submit.prevent="handleRegister">
      <div class="username">
        <label for="username">Username</label>
        <input
          type="text"
          id="username"
          v-model="formData.username"
        />
        <span v-if="formErrors.username" class="text-danger">{{ formErrors.username }}</span>
      </div>

      <div class="email">
        <label for="email">Email</label>
        <input
          type="email"
          id="email"
          v-model="formData.email"
        />
        <span v-if="formErrors.email" class="text-danger">{{ formErrors.email }}</span>
      </div>

      <div class="password">
        <label for="password">Password</label>
        <input
          type="password"
          id="password"
          v-model="formData.password"
        />
        <span v-if="formErrors.password" class="text-danger">{{ formErrors.password }}</span>
      </div>

      <div class="confirm-password">
        <label for="confirmPassword">Confirm Password</label>
        <input
          type="password"
          id="confirmPassword"
          v-model="formData.confirmPassword"
        />
        <span v-if="formErrors.confirmPassword" class="text-danger">{{ formErrors.confirmPassword }}</span>
      </div>

      <p v-if="successMessage" class="text-success">{{ successMessage }}</p>
      <p v-if="serverError" class="text-danger server-error">{{ serverError }}</p>

      <button type="submit" class="submit-button">Create Account</button>
    </form>
  </section>

  <div class="login-link">
    <p>
      Already have an account?
      <router-link to="/login" class="btn"> Log in </router-link>
    </p>
  </div>
</template>
