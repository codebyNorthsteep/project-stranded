<script setup>
import { useRouter } from "vue-router";
import { onMounted } from "vue";
import confetti from "canvas-confetti";

defineProps({
  message: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["next-level"]);
const router = useRouter();

function goToDashboard() {
  router.push({ name: "MyDashboard" });
}

// Confetti

var duration = 5 * 1000;
var end = Date.now() + duration;

(function frame() {
  // launch a few confetti from the left edge
  confetti({
    particleCount: 4,
    angle: 60,
    spread: 55,
    origin: { x: 0 }
  });
  // and launch a few from the right edge
  confetti({
    particleCount: 4,
    angle: 120,
    spread: 55,
    origin: { x: 1 }
  });

  // keep going until we are out of time
  if (Date.now() < end) {
    requestAnimationFrame(frame);
  }
}());
</script>

<template>
  <section class="level-completed">
    <h2 class="level-completed-title">Nivå avklarad!</h2>

    <div class="button-group">
      <button @click="emit('next-level')">Börja nästa nivå</button>
      <button @click="goToDashboard">Gå till meny</button>
    </div>
  </section>
</template>

<style scoped>
:global(html),
:global(body) {
  min-height: 100%;
  background-color: var(--bg-dark);
}

:global(#app) {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  min-height: 100dvh;
}

:global(header),
:global(footer) {
  flex-shrink: 0;
}

:global(main) {
  display: flex;
  flex: 1 0 auto;
  flex-direction: column;
}

.level-completed {
  display: flex;
  flex-direction: column;
  flex: 1;
  width: 100%;
  max-width: 416px;
  margin-inline: auto;
  text-align: center;
  background-color: var(--bg-dark);
  padding: 24px 16px;
  border-radius: 8px;
}

.level-completed-title {
  color: var(--accent-gold);
  font-size: 24px;
}

.button-group {
  display: flex;
  gap: 12px;
  margin-top: auto;
  width: 100%;
}

.button-group button {
  flex: 1;
  min-height: 48px;
  padding: 12px 16px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background-color: var(--card-bg);
  color: var(--accent-gold);
  font: inherit;
  font-weight: 700;
  cursor: pointer;
  touch-action: manipulation;
}
</style>
