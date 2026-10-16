<script setup>
import { useRouter } from 'vue-router'

defineProps({
  score: {
    type: Number,
    default: 0,
  },
  explanation: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['restart'])
const router = useRouter()

function goToMenu() {
  router.push({ name: 'Welcome' })
}
</script>

<template>
  <section class="game-over">
    <h2 class="game-over-title">Spelet är slut</h2>
    <p class="status-message">Du skulle dö!</p>
    <p v-if="explanation" class="explanation">{{ explanation }}</p>
    <p class="score">Poäng: {{ score }}</p>
    <button class="button" @click="emit('restart')">Spela igen</button>
    <button class="button" @click="goToMenu">Till startmenyn</button>
  </section>
</template>

<style scoped>
.game-over {
  width: 100%;
  max-width: 416px;
  margin-inline: auto;
  text-align: center;
  background-color: var(--bg-dark);
  padding: 24px 16px;
  border-radius: 8px;
}

.game-over-title {
  color: var(--accent-gold);
  font-size: 24px;
}

.score {
  font-weight: 700;
}

.game-over button {
  width: 100%;
  min-height: 48px;
  font-weight: 700;
  touch-action: manipulation;
}

@media (min-width: 640px) {
  .game-over {
    padding: 32px;
  }

  .game-over button:first-of-type {
  margin-top: 16px;
}
 .game-over button {
  display: flex;
  margin-inline: auto;
}
 .game-over button + button {
  margin-top: 16px;
}
}
</style>