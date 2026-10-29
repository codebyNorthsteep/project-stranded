<script setup>
import LoginForm from "../../components/LoginForm.vue";
import SocialLogin from "../../components/SocialLogin.vue";
</script>

<template>
  <p class="slogan">your knowledge is your survival tool</p>

  <LoginForm />
  <SocialLogin />
  
  <div class="register-link">
    <p>
      Har du inget konto?
      <router-link to="/register" class="button">Registrera dig</router-link>
    </p>
  </div>
</template>

<style scoped>
.slogan {
  text-align: center;
  font-size: 1.1rem;
  margin-bottom: 20px;
  margin-top: 20px;
}

.register-link {
  text-align: center;
  margin-top: 30px;
  margin-bottom: 30px;
}

.button {
  margin-top: 10px;
}

@media (min-width: 768px) and (max-width: 1023px) {
  .slogan {
    font-size: 2rem;
  }
}
@media (min-width: 1024px) {
  .slogan {
    font-size: 2.6rem;
  }
  .register-link {
    margin-top: 40px;
    margin-bottom: 40px;
  }
}
</style>
