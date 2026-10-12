<script setup>
defineProps({
  score: {
    type: Number,
    default: 0,
  },
})

const emit = defineEmits(['restart'])
</script>

<template>
  <section class="game-over">
    <h2 class="game-over-title">Spelet är slut</h2>
    <p class="status-message">Du förlorade!</p>
    <p class="score">Poäng: {{ score }}</p>
    <button @click="emit('restart')">Spela igen</button>
  </section>
</template>

<style scoped>
.game-over {
  text-align: center;
  box-sizing: border-box;
  width: min(100%, 26rem);
  margin-inline: auto;
  text-align: center;
  background-color: #16230E;
  padding: 1.5rem 1rem;
  border-radius: 8px;
}

.game-over-title {
  margin-top: 0;
  color: #D1982A;
  font-size: 1.5rem;
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
  padding: 0.75rem 1rem;
  border: 0;
  border-radius: 4px;
  background-color: #28391C;
  color: #D1982A;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
  touch-action: manipulation;
}

@media (min-width: 40rem) {
  .game-over {
    padding: 2rem;
  }

  .game-over button {
    width: auto;
    min-width: 10rem;
  }
}
</style>