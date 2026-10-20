<template>
  <div class="welcome-buttons">
    <div class="login">
      <p>Logga in och börja din resa</p>
      <router-link to="/login" class="button" role="button">
        Logga in
      </router-link>
    </div>

    <div class="register">
      <p>eller registrera dig</p>
      <router-link to="/register" class="button" role="button">
        Registrera dig
      </router-link>
    </div>
  </div>
</template>

<style scoped>
p {
  text-align: center;
  font-size: 0.8rem;
  margin-bottom: 10px;
  margin-top: 10px;
}

.login,
.register {
  text-align: center;
}

.register {
  margin-top: 20px;
  margin-bottom: 30px;
}

@media (min-width: 768px) and (max-width: 1023px) {
  p {
    font-size: 1.15rem;
  }

  .button {
    font-size: 1.15rem;
    min-width: 125px;
    padding: 7px 24px;
  }
}

@media (min-width: 1024px) {
    p {
        font-size: 1.3rem;
    }

    .button {
    font-size: 1.3rem;
    min-width: 200px;
    padding: 9px 28px;
  }
}


</style>
