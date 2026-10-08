<script setup></script>

<template>

  <header>
    <h3 class="slogan">your knowledge is your survival tool</h3>
  </header>

  <section class="login-section">
    <form @submit.prevent="handleLogin" novalidate>
      <div class="username">
        <label for="username" class="form-label">Username or Email address</label>
        <input type="text" class="form-control" id="username" required/>
      </div>

      <div class="password">
        <label for="password" class="form-label">Password</label>
        <input type="password" class="form-control" id="password" required/>
      </div>

      <button type="submit" class="btn btn-primary">Log in</button>

    </form>
  </section>

  <div class="register-link">
    <p>
      Don't you have an account?
      <router-link to="/register" class="btn"> Register </router-link>
    </p>
  </div>

</template>
