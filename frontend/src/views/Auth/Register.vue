<script setup>
import RegisterForm from "../../components/RegisterForm.vue";
</script>

<template>
  <p class="subtitle">join the survival arena and test your wits</p>

  <RegisterForm />

  <div class="login-link">
    <p>
      Har du redan ett konto?
      <router-link to="/login" class="button"> logga in </router-link>
    </p>
  </div>
</template>

<style scoped>
.subtitle {
  text-align: center;
  font-size: 1.1rem;
  margin-bottom: 20px;
  margin-top: 20px;
  padding-left: 25px;
  padding-right: 25px;
}

.login-link {
  text-align: center;
  margin-top: 30px;
  margin-bottom: 30px;
}

.button {
  margin-top: 10px;
}

@media (min-width: 768px) and (max-width: 1023px) {
  .subtitle {
    font-size: 2rem;
  }
}
@media (min-width: 1024px) {
  .subtitle {
    font-size: 2.6rem
  }
  .login-link {
    margin-top: 40px;
    margin-bottom: 40px;
  }
}
</style>
