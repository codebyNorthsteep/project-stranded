<script setup>
import { ref, onMounted } from "vue";

const stats = ref([
  { level_id: 1, correct_answers: 0, wrong_answers: 0, unlocked: true },
  { level_id: 2, correct_answers: 0, wrong_answers: 0, unlocked: false },
  { level_id: 3, correct_answers: 0, wrong_answers: 0, unlocked: false },
]);

const statslog = ref([]);

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

    const levelsUrl = `http://localhost:3000/api/users/${user.id}/statistics/levels`;
    const questionUrl = `http://localhost:3000/api/users/${user.id}/statistics/current-question`;
    const userStatsLogUrl = `http://localhost:3000/api/users/${user.id}/statistics/log/`;

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const [statsResponse, questionResponse, userStatsLogResponse] = await Promise.all([
      fetch(levelsUrl, { headers }),
      fetch(questionUrl, { headers }),
      fetch(userStatsLogUrl, { headers }),
]);
    if (!statsResponse.ok || !questionResponse.ok || !userStatsLogResponse.ok) {
      throw new Error("Kunde inte hämta statistiken.");
    }

    const { levels } = await statsResponse.json();
    const question = await questionResponse.json();
    const { statistics_log } = await userStatsLogResponse.json();
    statslog.value = statistics_log;

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
      <section class="level-card">
        <h3>Statistiklogg</h3>

        <p v-if="statslog.length === 0">Inga loggposter ännu.</p>

        <ul v-else>
          <li v-for="event in statslog" :key="event.stat_id">
            {{ new Date(event.answer_timestamp).toLocaleString("sv-SE") }}
            <span :class="event.is_correct ? 'answer-correct' : 'answer-wrong'">
            {{ event.is_correct ? "Rätt" : "Fel" }}
            </span>
            svar på
            {{ event.question_title }}
            ({{ levelNames[event.level_id] ?? event.level_id }})
          </li>
        </ul>
      </section>
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

h3 {
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

.level-card p {
  margin: 6px 0;
  color: var(--accent-gold);
}
.answer-correct {
  color: #7ed957;
  font-weight: 600;
}

.answer-wrong {
  color: #ff6b6b;
  font-weight: 600;
}
</style>