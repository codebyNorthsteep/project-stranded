<script setup>
import { ref, onMounted } from "vue";

const stats = ref([
  { level_id: 1, correct_answers: 0 },
  { level_id: 2, correct_answers: 0 },
  { level_id: 3, correct_answers: 0 }
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
    <h2 class="stats-title">Din statistik</h2>

    <div class="stat-card stat-level-1">
      <span class="label">Svenska skog</span>
      <strong>{{ getLevelCount(1) }}</strong>
    </div>

    <div class="stat-card stat-level-2">
      <span class="label">Amazonas</span>
      <strong>{{ getLevelCount(2) }}</strong>
    </div>

    <div class="stat-card stat-level-4">
      <span class="label">Sahara</span>
      <strong>{{ getLevelCount(3) }}</strong>
    </div>
  </div>
</template>

<style scoped>
.stats-panel {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-areas:
    "title"
    "level1"
    "level2"
    "level3";
  align-content: start;
  gap: 12px;
  width: 100%;
  box-sizing: border-box;
  padding: 20px;
  color: var(--text-light);
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.stats-title {
  grid-area: title;
  margin: 0;
  color: var(--text-light);
  text-align: center;
}

.stat-level-1 {
  grid-area: level1;
}

.stat-level-2 {
  grid-area: level2;
}

.stat-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px;
  color: var(--text-light);
  background: rgba(18, 29, 17, 0.55);
  border: 1px solid var(--border-color);
  border-radius: 12px;
}

.stat-level-3 {
  grid-area: level4;
}

.label {
  color: var(--text-muted);
}

.stat-card strong {
  color: var(--accent-gold);
}
</style>