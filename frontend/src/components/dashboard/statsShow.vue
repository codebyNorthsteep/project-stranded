
<script setup>
import { ref, onMounted } from "vue";

const stats = ref([
  { level_id: 1, correct_answers: 0, wrong_answers: 0, unlocked: true },
  { level_id: 2, correct_answers: 0, wrong_answers: 0, unlocked: false },
  { level_id: 3, correct_answers: 0, wrong_answers: 0, unlocked: false },
]);

const levelNames = {
  1: "Svenska skog",
  2: "Amazonas",
  3: "Sahara",
};

function getLevel(id) {
  return stats.value.find((level) => Number(level.level_id) === id);
}

async function fetchStats() {
  try {
    const token = localStorage.getItem("user_token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!token || !user) return;

    const url = `http://localhost:3000/api/users/${user.id}/statistics`;
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const [statsResponse, questionResponse] = await Promise.all([
      fetch(`${url}/levels`, { headers }),
      fetch(`${url}/current-question`, { headers }),
    ]);

    if (!statsResponse.ok || !questionResponse.ok) {
      throw new Error("Kunde inte hämta statistiken.");
    }

    const { levels } = await statsResponse.json();
    const question = await questionResponse.json();

    const currentLevelId =
      Number(question?.current_level_id) || 1;

    stats.value = levels.map((level) => ({
      ...level,
      unlocked: Number(level.level_id) <= currentLevelId,
    }));
  } catch (error) {
    console.error("Fel vid hämtning av statistik:", error);
  }
}

onMounted(fetchStats);
</script>

<template>
  <div class="stats-panel">
    <h2>Min statistik</h2>

    <div
      v-for="id in [1, 2, 3]"
      :key="id"
      class="level-card"
    >
      <h3>{{ levelNames[id] }}</h3>

      <template v-if="getLevel(id)?.unlocked">
        <p>
          Rätt svar:
          {{ getLevel(id)?.correct_answers ?? 0 }}
        </p>

        <p>
          Fel svar:
          {{ getLevel(id)?.wrong_answers ?? 0 }}
        </p>
      </template>

      <p v-else>
        🔒 Låst nivå
      </p>
    </div>
  </div>
</template>

<style scoped>
.stats-panel {
  padding: 22px;
  border: 1px solid var(--border-color);
  border-top: 3px solid var(--accent-gold);
  border-radius: 18px;
  background: var(--card-bg);
  color: var(--accent-gold);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.16);
}

h2 {
  margin-bottom: 20px;
  color: var(--accent-gold);
}

.level-card {
  padding: 16px;
  margin-bottom: 12px;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  background: rgba(18, 29, 17, 0.35);
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.10);
  transition: border-color 0.2s ease, background 0.2s ease;
}

.level-card:hover {
  border-color: var(--accent-gold);
  background: rgba(18, 29, 17, 0.5);
}

.level-card h3 {
  margin-top: 0;
  margin-bottom: 12px;
  color: var(--accent-gold);
}

.level-card p {
  margin: 6px 0;
  color: var(--accent-gold);
}
</style>