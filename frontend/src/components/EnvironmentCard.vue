<script setup>
import { ref } from "vue";

defineProps({
  environment: {
    type: Object,
    required: true,
  },
});

const showInfo = ref(false);
</script>

<template>
  <article
    class="environment-card"
    @mouseenter="showInfo = true"
    @mouseleave="showInfo = false"
  >
    <img :src="environment.src" :alt="environment.alt" class="card-image" />

    <div v-if="showInfo" class="info-overlay">
      <h2>{{ environment.title }}</h2>
      <p>{{ environment.info }}</p>
    </div>
  </article>
</template>

<style scoped>
.environment-card {
  position: relative;
  flex: 1;
  min-width: 0;
  aspect-ratio: 3 / 4;
  overflow: hidden;
  border: 1.5px solid var(--accent-gold);
  border-radius: 8px;
  box-shadow: 0 4px 8px rgb(0 0 0 / 10%);
}

.card-image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.info-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  box-sizing: border-box;
  background-color: rgb(0 0 0 / 75%);
  color: #fff;
  text-align: center;
}

.info-overlay h2 {
  margin: 0 0 10px;
  font-size: 1.5rem;
}

.info-overlay p {
  color: inherit;
  line-height: 1.5;
}

@media (min-width: 640px) and (max-width: 1024px) {
  .environment-card {
    height: 400px;
    aspect-ratio: auto;
  }
}
</style>
