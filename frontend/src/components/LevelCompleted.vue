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
    <Confetti :duration="5000" />

    <div class="level-completed-content">
      <h2 class="level-completed-title">Nivå avklarad!</h2>

      <div class="button-group">
        <button type="button" @click="emit('next-level')">Börja nästa nivå</button>
        <button type="button" @click="goToDashboard">Gå till meny</button>
      </div>
    </div>
  </dialog>
</template>

<style scoped>
.level-completed-dialog {
  border: 1px solid var(--accent-gold);
  border-radius: 8px;
  background-color: var(--bg-dark);
  padding: 24px;
  max-width: 416px;
  width: 90%;
  margin: auto;
  color: var(--accent-gold);
  overflow: visible;
}

.level-completed-dialog::backdrop {
  background-color: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(2px);
}

.level-completed-content {
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  text-align: center;
}

.level-completed-title {
  color: var(--accent-gold);
  font-size: 24px;
  margin: 0;
}

.button-group {
  display: flex;
  gap: 12px;
  width: 100%;
}

.button-group button {
  flex: 1;
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
  outline: none;
}

.button-group button:focus {
  outline: none;
}
</style>