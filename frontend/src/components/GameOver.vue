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
    <h2>Spelet är slut</h2>
    <p>Du förlorade!</p>
    <p>Poäng: {{ score }}</p>
    <button @click="emit('restart')">Spela igen</button>
  </section>
</template>

<style scoped>
.game-over {
  text-align: center;
}
</style>

<script setup>
</script>

<template>
  <section class="game-over">
    <h2>Spelet är slut</h2>
  </section>
</template>

<style scoped>
.game-over {
  text-align: center;
  padding: 2rem;
  background-color: #222;
  color: white;
}
</style>