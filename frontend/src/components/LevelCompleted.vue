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
  max-width: 240px;
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

.button-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  margin-top: 15px;
}

.button-group button:focus {
  outline: none;
  box-shadow: none;
}

@media (min-width: 768px) {
  .level-completed-dialog {
    max-width: 440px;
  }

  .level-completed-title{
    font-size: 1.7rem;
  }

  .button-group {
    flex-direction: row;
    gap: 25px;
  }
}
</style>
