<script setup>
import { ref, onMounted } from "vue";

const stats = ref([
  { level_id: 1, correct_answers: 0 },
  { level_id: 2, correct_answers: 0 },
  { level_id: 4, correct_answers: 0 }
]);

const userId = ref(null);

const getLevelCount = (levelId) => {
  const match = stats.value.find(item => Number(item.level_id) === Number(levelId));
  return match ? match.correct_answers : 0;
};

const fetchStats = async () => {
  const token = localStorage.getItem("user_token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  userId.value = user.id;

  if (!userId.value) return;

  const response = await fetch(`http://localhost:3000/api/statistics/${userId.value}/levels`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!response.ok) throw new Error("Kunde inte hämta statistik");

  const data = await response.json();
  stats.value = data.levels;
};

onMounted(() => {
  fetchStats();
});
</script>

<template>
  <div class="stats-panel">
    <h2>Din statistik</h2>

    <div class="stats-grid">
      <div class="stat-card">
        <span class="label">Nivå 1</span>
        <strong>{{ getLevelCount(1) }}</strong>
      </div>

      <div class="stat-card">
        <span class="label">Nivå 2</span>
        <strong>{{ getLevelCount(2) }}</strong>
      </div>

      <div class="stat-card">
        <span class="label">Nivå 3</span>
        <strong>{{ getLevelCount(3) }}</strong>
      </div>
    </div>
  </div>
</template>

<style scoped>
.stats-panel {
  display: grid;
  gap: 16px;
  width: 100%;
  max-width: 300px;
  background: #111;
  color: white;
  padding: 20px;
  border-radius: 16px;
  border: 2px solid #333;
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

.stat-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 12px;
  padding: 14px 16px;
}

.label {
  font-size: 0.95rem;
}

strong {
  font-size: 1.4rem;
}
</style>