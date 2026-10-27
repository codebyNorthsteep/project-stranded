<script setup>
import { useRouter } from "vue-router";
import { ref, onMounted } from "vue";

defineProps({
  explanation: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["restart"]);
const router = useRouter();
const gameOverDialog = ref(null);

function GoToMyDashboard() {
  router.push({ name: "MyDashboard" });
}

onMounted(() => {
  gameOverDialog.value?.showModal();
});
</script>

<template>
  <dialog
    ref="gameOverDialog"
    class="game-over-dialog"
    closedby="none"
    @keydown.esc.prevent.stop
    @cancel.prevent
  >
    <h2 class="game-over-title">Spelet är slut</h2>
    <div class="game-over-content">
      <h3 class="status-message">Fel svar!</h3>
      <p v-if="explanation" class="explanation">{{ explanation }}</p>
    </div>
    <div class="button-group">
      <button type="button" class="button" @click="emit('restart')">
        Spela igen
      </button>
      <button type="button" class="button" @click="GoToMyDashboard">
        Gå till dashboard
      </button>
    </div>
  </dialog>
</template>

<style scoped>
.game-over-dialog[open] {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.game-over-dialog {
  border: 1px solid var(--accent-gold);
  border-radius: 8px;
  background-color: var(--bg-dark);
  padding: 24px;
  max-width: 400px;
  width: 90%;
  margin: auto;
  color: var(--accent-gold);
  overflow: visible;
}

.game-over-dialog::backdrop {
  background-color: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(2px);
}

.game-over-title {
  color: var(--accent-gold);
  font-size: 1.4rem;
  margin: 0;
  text-align: center;
}

h3 {
  margin: 0 0 10px;
  color: var(--accent-gold);
}

.game-over-content {
  margin-top: 15px;
  text-align: left;
  margin: 20px 0;
  border: 3px solid var(--border-color);
  border-radius: 10px;
  padding: 20px;
  letter-spacing: 0.08em;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.8);
}

.button-group {
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
  margin-top: 15px;
}

.button-group button:focus {
  outline: none;
  box-shadow: none;
}

.button-group button:focus-visible {
  outline: 2px solid var(--accent-gold);
  outline-offset: 2px;
}

@media (min-width: 768px) {
  .game-over-dialog {
    max-width: 440px;
  }

  .game-over-dialog-title {
    font-size: 1.7rem;
  }

  .button-group {
    flex-direction: row;
    justify-content: center;
    gap: 25px;
  }
}
</style>
