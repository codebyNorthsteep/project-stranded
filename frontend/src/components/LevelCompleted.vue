<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import Confetti from "@/components/Confetti.vue";

defineProps({
  message: {
    type: String,
    default: "",
  },
  summary: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["next-level"]);
const router = useRouter();
const levelCompletedDialog = ref(null);

function goToDashboard() {
  router.push({ name: "MyDashboard" });
}

onMounted(() => {
  levelCompletedDialog.value?.showModal();
});
</script>

<template>
  <dialog ref="levelCompletedDialog" class="level-completed-dialog">
    <Confetti :duration="3000" />

    <div class="level-completed-content">
      <p class="level-completed-title">Nivå avklarad!</p>
      <div class="level-completed-summary">
        <h3>Vad du har lärt dig:</h3>
        <p>{{ summary }}</p>
      </div>

      <div class="button-group">
        <button type="button" class="button" @click="emit('next-level')">
          Börja nästa nivå
        </button>
        <button type="button" class="button" @click="goToDashboard">
          Gå till dashboard
        </button>
      </div>
    </div>
  </dialog>
</template>

<style scoped>
.level-completed-dialog[open] {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.level-completed-dialog {
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

.level-completed-dialog::backdrop {
  background-color: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(2px);
}

.level-completed-title {
  color: var(--accent-gold);
  font-size: 1.4rem;
  margin: 0;
  text-align: center;
}

h3 {
  margin: 0 0 10px;
  color: var(--accent-gold);
}

.level-completed-summary {
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
  .level-completed-dialog {
    max-width: 760px;
  }

  .level-completed-title {
    font-size: 1.7rem;
  }

  .button-group {
    flex-direction: row;
    gap: 25px;
    justify-content: center;
  }
}
</style>
