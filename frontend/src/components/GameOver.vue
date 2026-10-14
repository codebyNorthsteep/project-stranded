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
    <button @click="emit('restart')">Spela igen</button>
    <button @click="goToMenu">Till startmenyn</button>
  </section>
</template>

<style scoped>
.game-over {
  box-sizing: border-box;
  width: 100%;
  max-width: 416px;
  margin-inline: auto;
  text-align: center;
  background-color: #16230E;
  padding: 24px 16px;
  border-radius: 8px;
}

.game-over-title {
  margin-top: 0;
  color: #D1982A;
  font-size: 24px;
}

.status-message {
  color: #D1982A;
}

.score {
  color: #D1982A;
  font-weight: 700;
}

.game-over button {
  width: 100%;
  min-height: 48px;
  padding: 12px 16px;
  border: 0;
  border-radius: 4px;
  background-color: #28391C;
  color: #D1982A;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
  touch-action: manipulation;
}

@media (min-width: 640px) {
  .game-over {
    padding: 32px;
  }
  }
@media (min-width: 640px) {
  .game-over button {
    width: auto;
    min-width: 160px;
  }
}
</style>