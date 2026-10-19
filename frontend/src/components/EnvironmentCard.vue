<script setup>
import { ref } from "vue";

defineProps({
  environment: {
    type: Object,
    required: true,
  },
});

const infoDialog = ref(null);

function openInfo() {
  infoDialog.value?.showModal();
}

function closeInfo() {
  infoDialog.value?.close();
}

function closeOnBackdrop(event) {
  if (event.target === event.currentTarget) {
    closeInfo();
  }
}
</script>

<template>
  <article class="environment-card">
    <img :src="environment.src" :alt="environment.alt" class="card-image" />

    <h2 class="environment-title">{{ environment.title }}</h2>

    <button
      type="button"
      class="button info-button"
      :aria-label="`Läs mer om ${environment.title}`"
      @click="openInfo"
    >
      Läs mer
    </button>

    <dialog
      ref="infoDialog"
      class="info-dialog"
      :aria-labelledby="`environment-title-${environment.id}`"
      :aria-describedby="`environment-info-${environment.id}`"
      @click="closeOnBackdrop"
    >
      <h2 :id="`environment-title-${environment.id}`">
        {{ environment.title }}
      </h2>
      <p :id="`environment-info-${environment.id}`">{{ environment.info }}</p>
      <button type="button" class="button close-button" @click="closeInfo">
        Stäng
      </button>
    </dialog>
  </article>
</template>

<style scoped>
.environment-card {
  position: relative;
  isolation: isolate;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  flex: 1;
  min-width: 0;
  min-height: 320px;
  padding: 24px;
  overflow: hidden;
  border: 1.5px solid var(--accent-gold);
  border-radius: 8px;
  box-shadow: 0 4px 8px rgb(0 0 0 / 10%);
}

.environment-card::before {
  position: absolute;
  z-index: 1;
  inset: 0;
  background: linear-gradient(rgb(18 29 17 / 25%), rgb(18 29 17 / 55%));
  content: "";
  pointer-events: none;
}

.card-image {
  position: absolute;
  z-index: 0;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.environment-title,
.info-button {
  position: relative;
  z-index: 2;
}

.environment-title {
  color: var(--accent-gold);
  text-align: center;
}

.info-button {
  width: auto;
  align-self: center;
  min-height: 44px;
  font-weight: 700;
  touch-action: manipulation;
}
.close-button {
  width: 100%;
  align-self: center;
  min-height: 44px;
  font-weight: 700;
  touch-action: manipulation;
}

.info-button:focus-visible,
.close-button:focus-visible {
  outline: 2px solid var(--accent-gold);
  outline-offset: 2px;
}

.info-dialog {
  width: min(90vw, 420px);
  max-height: 80vh;
  margin: auto;
  padding: 24px;
  border: 1px solid var(--accent-gold);
  border-radius: 8px;
  background-color: var(--bg-dark);
  color: var(--text-light);
  text-align: center;
  font-family: inherit;
}

.info-dialog::backdrop {
  background-color: rgb(0 0 0 / 70%);
}

.info-dialog h2 {
  margin: 0 0 12px;
  color: var(--accent-gold);
  font-size: 1.5rem;
}

.info-dialog p {
  margin-bottom: 20px;
  color: var(--text-light);
  line-height: 1.5;
}

@media (min-width: 1024px) {
  .environment-card {
    height: 400px;
  }

  .card-image {
    flex: 1;
    min-height: 0;
    aspect-ratio: auto;
  }
}
</style>
