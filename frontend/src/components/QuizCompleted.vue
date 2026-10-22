<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import Confetti from "@/components/Confetti.vue";

defineProps({
  message: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["first-level"]);
const router = useRouter();
const quizCompletedDialog = ref(null);

function goToDashboard() {
  router.push({ name: "MyDashboard" });
}

onMounted(() => {
  quizCompletedDialog.value?.showModal();
});
</script>

<template>
  <dialog ref="quizCompletedDialog" class="quiz-completed-dialog">
    <Confetti :duration="10000" />

    <div class="quiz-completed-content">
      <p class="quiz-completed-title">Quiz avklarat!</p>
      <p class="quiz-completed-subtitle">Grattis 🎉 du har klarat alla nivåer</p>

      <div class="button-group">
        <button type="button" class="button" @click="emit('first-level')">
          Börja om från första nivån
        </button>
        <button type="button" class="button" @click="goToDashboard">
          Gå till dashboard
        </button>
      </div>
    </div>
  </dialog>
</template>

<style scoped>
.quiz-completed-dialog[open] {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.quiz-completed-dialog {
  border: 1px solid var(--accent-gold);
  border-radius: 8px;
  background-color: var(--bg-dark);
  padding: 24px;
  max-width: 240px;
  width: 90%;
  margin: auto;
  color: var(--accent-gold);
  overflow: visible;
}

.quiz-completed-dialog::backdrop {
  background-color: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(2px);
}

.quiz-completed-title {
  color: var(--accent-gold);
  font-size: 1.4rem;
  margin: 0;
  text-align: center;
  margin-bottom: 15px;
}

.quiz-completed-subtitle {
  font-size: 0.9rem;
  margin-bottom: 20px;
}

.button-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  margin-top: 15px;
}

.button-group .button {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  width: 100%;
}

.button-group button:focus {
  outline: none;
  box-shadow: none;
}

@media (min-width: 768px) {
  .quiz-completed-dialog {
    max-width: 600px;
    padding: 32px
  }

  .quiz-completed-title {
    font-size: 1.7rem;
  }

  .button-group {
    flex-direction: row;
    gap: 25px;
  }

  .button-group .button {
    flex: 1;
  }
}
</style>
