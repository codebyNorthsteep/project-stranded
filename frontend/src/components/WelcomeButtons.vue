<template>
  <div class="welcome-buttons">
    <div class="login">
      <p>Logga in och börja din resa</p>
      <router-link to="/login" class="button" role="button">
        log in
      </router-link>
    </div>

    <div class="register">
      <p>eller registrera dig</p>
      <router-link to="/register" class="button" role="button">
        register
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

.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  font-size: 0.8rem;
  gap: 16px;
  background-color: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 5px 20px;
  color: var(--text-light);
  text-align: left;
  cursor: pointer;
  transition: background-color 0.2s ease, border-color 0.2s ease;
}
 
.button:hover {
  border-color: var(--accent-gold);
  background-color: #21331f;
}

@media (min-width: 768px) and (max-width: 1023px) {
  p {
    font-size: 1.15rem;
  }

  .button {
    font-size: 1.15rem;
    width: 125px;
    padding: 7px 24px;
  }
}

@media (min-width: 1024px) {
    p {
        font-size: 1.3rem;
    }

    .button {
    font-size: 1.3rem;
    width: 140px;
    padding: 9px 28px;
  }
}


</style>
