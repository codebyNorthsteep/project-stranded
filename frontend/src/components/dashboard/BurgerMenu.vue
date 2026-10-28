<script setup>
import { ref } from "vue";
import MyProfile from "../MyProfile.vue";
import Logout from "../Logout.vue";

const isOpen = ref(false);

const toggleMenu = () => {
  isOpen.value = !isOpen.value;
};
</script>

<template>
  <div class="burger-container">
    <button class="button" @click="toggleMenu">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="icon"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M4 6h16M4 12h16M4 18h16"
        />
      </svg>
    </button>

    <div v-if="isOpen" class="overlay" @click="toggleMenu"></div>

    <div class="burger-menu" :class="{ 'is-open': isOpen }">
      <header class="menu-header">
        <div class="profile-title">
          <h1>Min Profil</h1>
        </div>
        <button class="button close-button" @click="toggleMenu">✕</button>
      </header>

      <main class="menu-main">
        <MyProfile />
      </main>

      <footer class="menu-footer">
        <Logout @click="isOpen = false" />
      </footer>
    </div>
  </div>
</template>

<style scoped>
.button {
  padding: 4px;
  margin-top: 20px;
}

.icon {
  width: 22px;
  height: 22px;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 998;
}

.burger-menu {
  position: fixed;
  top: 0;
  right: -100%;
  width: 100vw;
  height: 100vh;
  background-color: var(--card-bg);
  transition: right 0.3s ease;
  z-index: 999;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-sizing: border-box;
}

.burger-menu.is-open {
  right: 0;
}

.menu-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.close-button {
  padding: 5px 8px;
  margin-top: 0;
}

h1 {
  font-size: 1.7rem;
  margin: 0;
}

.menu-main {
  border-top: 2px solid var(--accent-gold);
}

.menu-footer {
  display: flex;
  justify-content: center;
  margin-top: -25px;
}

@media (min-width: 350px) {
  .burger-menu {
    width: 300px;
    right: -300px;
  }

  .overlay {
    width: calc(100vw - 300px);
    left: 0;
    background-color: rgba(0, 0, 0, 0.6);
  }
}

@media (min-width: 768px) and (max-width: 1023px) {
  .button {
    padding: 6px;
    margin-top: 25px;
  }

  .icon {
    width: 31px;
    height: 28px;
  }

  .close-button {
    padding: 6px 10px;
  }
}

@media (min-width: 1024px) {
  .button {
    padding: 8px;
    margin-top: 25px;
  }

  .icon {
    width: 33px;
    height: 30px;
  }
}
</style>
