<script setup>
import { useRouter } from 'vue-router'

defineProps({

  explanation: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['restart'])
const router = useRouter()

function goToMenu() {
  router.push({ name: 'MyDashboard' })
}
</script>

<template>
  <section class="game-over">
    <h2 class="game-over-title">Spelet är slut</h2>
    <p class="status-message">Du skulle dö!</p>
    <p v-if="explanation" class="explanation">{{ explanation }}</p>
    <button @click="emit('restart')">Spela igen</button>
    <button @click="goToMenu">Till startmenyn</button>
  </section>
</template>

<style scoped>

.game-over {
  display: flex;
  flex-direction: column;
  flex: 1;
  width: 100%;
  max-width: 416px;
  margin-inline: auto;
  padding: 24px 16px;
  border-radius: 8px;
  background-color: var(--bg-dark);
  text-align: center;
}

.game-over-title {
  color: var(--accent-gold);
  font-size: 24px;
}

.game-over button:first-of-type {
  margin-top: auto;
}

.game-over button {
  width: 100%;
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

.game-over button + button {
  margin-top: 12px;
}

@media (min-width: 768px){
  .game-over {
    padding: 32px;
  }

  .game-over button {
    width: auto;
    min-width: 160px;
  }
}
</style>