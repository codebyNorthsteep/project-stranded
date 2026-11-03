<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import ClickableHeader from "./components/ClickableHeader.vue";
import UseAmbienceMusic from "@/components/UseAmbienceMusic.vue";

const route = useRoute();
const music = computed(() => route.meta.music ?? null);
</script>

<template>
  <ClickableHeader />
  
  <main class="main-content">
    <UseAmbienceMusic v-if="music" :src="music" />
    <RouterView />
  </main>

  <footer>
    <p class="footer-text">© 2026 Stranded. All rights reserved.</p>
    <p>Made with ❤️ by Caroline, Gabriela och Torsten</p>
  </footer>
</template>

<style scoped></style>
