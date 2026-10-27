<script setup>
import { ref, onMounted } from "vue";

const stats = ref([
  { level_id: 1, correct_answers: 0, wrong_answers: 0, unlocked: true },
  { level_id: 2, correct_answers: 0, wrong_answers: 0, unlocked: false },
  { level_id: 3, correct_answers: 0, wrong_answers: 0, unlocked: false },
]);

const userId = ref(null);

const getLevelCount = (levelId) => {
  const match = stats.value.find(
    (item) => Number(item.level_id) === Number(levelId),
  );
  return match ? match.correct_answers : 0;
};

const isLevelUnlocked = (levelId) =>
  stats.value.find((item) => Number(item.level_id) === Number(levelId))
    ?.unlocked ?? false;

const getWrongCount = (levelId) => {
  const match = stats.value.find(
    (item) => Number(item.level_id) === Number(levelId),
  );
  return match ? match.wrong_answers : 0;
};

const fetchStats = async () => {
  const token = localStorage.getItem("user_token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  userId.value = user.id;

  if (!userId.value) return;

  const response = await fetch(
    `http://localhost:3000/api/users/${userId.value}/statistics/levels`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

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

    <div class="stats-level-list">
        <div class="stats-column-heading">
          <span></span>
          <h3>Rätt</h3>
          <h3>Fel</h3>
        </div>
        <div class="stat-card">
          <span class="label">Svenska skog</span>
          <strong v-if="isLevelUnlocked(1)">{{ getLevelCount(1) }}</strong>
          <strong v-else class="not-available">🔒</strong>
          <strong v-if="isLevelUnlocked(1)">{{ getWrongCount(1) }}</strong>
          <strong v-else class="not-available">🔒</strong>
        </div>

        <div class="stat-card">
          <span class="label">Amazonas</span>
          <strong v-if="isLevelUnlocked(2)">{{ getLevelCount(2) }}</strong>
          <strong v-else class="not-available">🔒</strong>
          <strong v-if="isLevelUnlocked(2)">{{ getWrongCount(2) }}</strong>
        <strong v-else class="not-available">🔒</strong>
      </div>

        <div class="stat-card">
          <span class="label">Sahara</span>
          <strong v-if="isLevelUnlocked(3)">{{ getLevelCount(3) }}</strong>
          <strong v-else class="not-available">🔒</strong>
          <strong v-if="isLevelUnlocked(3)">{{ getWrongCount(3) }}</strong>
          <strong v-else class="not-available">🔒</strong>
        </div>
    </div>
  </div>
</template>

<style scoped>
.stats-panel {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-areas:
    "title"
    "levels";
  align-content: start;
  gap: 12px;
  width: 100%;
  box-sizing: border-box;
  padding: 20px;
  color: var(--text-light);
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-top: 2px solid var(--accent-gold);
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.stats-title {
  grid-area: title;
  margin: 0;
  color: var(--text-light);
  text-align: center;
}

.stats-column-heading {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 48px 48px;
  align-items: center;
  gap: 8px;
  color: var(--accent-gold);
  padding: 0 16px;
}

.stats-column-heading h3 {
  margin: 0;
  color: var(--text-muted);
  font-size: 0.85rem;
  font-weight: 600;
  text-align: right;
}


.stats-level-list {
  grid-area: levels;
  display: grid;
  gap: 10px;
  padding: 12px;
  background: rgba(18, 29, 17, 0.35);
  border: 1px solid var(--border-color);
  border-radius: 12px;
}

.stat-card {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 48px 48px;
  align-items: center;
  gap: 8px;
  padding: 14px 16px;
  color: var(--text-light);
  background: rgba(18, 29, 17, 0.55);
  border: 1px solid var(--border-color);
  border-radius: 12px;
}

.label {
  color: var(--text-muted);
}

.stat-card strong {
  color: var(--accent-gold);
  text-align: right;
}

.stat-card strong.not-available {
  color: var(--text-muted);
}
</style>
