<script setup>
import "@/Assets/quiz.css";
import { useRoute, useRouter } from "vue-router";
import { ref, onMounted, computed, watch } from "vue";
import LevelCompleted from "@/components/LevelCompleted.vue";
import QuizCompleted from "@/components/QuizCompleted.vue";
import GameOver from "@/components/GameOver.vue";

const route = useRoute();
const router = useRouter(); //Hämta router-instansen för att kunna navigera till nästa level efter att man har klarat alla frågor i en nivå

const loading = ref(false);
const error = ref(null);
const questions = ref([]);
const currentIndex = ref(0);
const levels = ref([]);

//håll koll på sekvensnumret för att hantera race conditions vid flera fetch-anrop
//todo: kolla på att refaktorera detta till en bättre lösning
let requestSequence = 0;

const savingProgress = ref(false);
const progressError = ref(null);
const pendingQuestionId = ref(null);

const selectedAnswerId = ref(null);
const validatedAnswer = ref(null);
const isLevelCompleted = ref(false);
const isQuizCompleted = ref(false);
const isGameOver = ref(false);
const gameOverExplanation = ref("");

const letters = ["A", "B", "C"];

const levelSummaries = {
  "Svensk skog":
    "Du har lärt dig att skaffa överblick från högsta punkten, välja rinnande vatten långt från föroreningar och tända eld med torr näver. Blöta kläder och kyla är en större fara än man tror, så håll dig varm och torka kläderna vid en eld. Om du går vilse ska du stanna, vara lugn och göra dig synlig. Ät aldrig svamp, växter eller bär som du inte är helt säker på.",
  Amazonas:
    "I regnskogen kan uttorkning börja redan efter en timme. Du har lärt dig att djurstigar kan leda till vatten, att kåda från kamfer eller eukalyptus skyddar mot insekter och att du ska testa marken med en käpp. Sov upphöjt från marken, och om du är vilse ska du följa rinnande vatten nedströms. Vatten från bambu och blad är en säker källa, men okända frukter kan vara giftiga.",
  Sahara:
    "I öknen gäller det att spara kroppens vatten: täck huden, drick regelbundet och rör dig när det är svalt. Vatten hittar du i låga punkter som uttorkade flodbäddar, och okänt vatten ska renas eller kokas. Natten är kall, så isolera mot marken och skaka ur skor och kläder innan du tar dem på dig. Vid sandstorm söker du lä bakom klippor, Polstjärnan visar norr, och räddningen ser dig bäst med ett stort SOS-tecken och ett blankt föremål som reflekterar solljus.",
};

//Ändra bakgrundsbild beroende på level_name
const getBackgroundId = computed(() => {
  if (!currentQuestion.value) return "";

  const name = currentQuestion.value.level_name?.toLowerCase();
  if (name?.includes("skog") || name?.includes("swedish"))
    return "level-background-svensk-skog";
  if (name?.includes("amazonas")) return "level-background-amazonas";
  if (name?.includes("sahara")) return "level-background-sahara";
  return "";
});

const currentQuestion = computed(() => questions.value[currentIndex.value]);
const isLast = computed(
  () => currentIndex.value === questions.value.length - 1,
);

const nextQuestion = () => {
  if(progressError.value) {
    // If there was an error saving progress, we don't proceed to the next question
    return;
  }
  if (!isLast.value) {
    currentIndex.value++;
    validatedAnswer.value = null;
    selectedAnswerId.value = null;
  } else {
    //If it's last question,
    //We have to check if it's the last question of the last level, in that case, we show the component quiz completed
    if (isLastLevelOfQuiz.value) {
      isQuizCompleted.value = true;
      //Otherwise, it's the last question of another level so we show the component level completed instead
    } else {
      isLevelCompleted.value = true;
    }
  }
};

const nextLevel = () => {
  isLevelCompleted.value = false;
  const currentLevelId = Number(route.params.levelId);
  const currentIndex = levels.value.findIndex(
    (l) => l.level_id === currentLevelId,
  );

  if (currentIndex !== -1 && currentIndex < levels.value.length - 1) {
    const nextLevelId = levels.value[currentIndex + 1].level_id;
    router.push(`/quiz/${nextLevelId}/questions`);
  }
};

//We need to handle first level in case the user press on the button "start quiz from first level" on quiz completed
const firstLevel = () => {
  if (levels.value.length === 0) return;

  const firstLevelId = levels.value[0].level_id;

  //If the first level is, ath the same time, the last level, we need to restart all the variables
  if (Number(route.params.levelId) === Number(firstLevelId)) {
    validatedAnswer.value = null;
    selectedAnswerId.value = null;
    currentIndex.value = 0;
    questions.value = [];
    isLevelCompleted.value = false;
    isQuizCompleted.value = false;
    isGameOver.value = false;
    gameOverExplanation.value = "";
    fetchQuestions(firstLevelId, { resume: false });
  } else {
    isQuizCompleted.value = false;
    router.push(`/quiz/${firstLevelId}/questions`);
  }
};

//If the user loses, we have to restart the level there the user was answering
const handleRestartCurrentLevel = () => {
  isGameOver.value = false;
  gameOverExplanation.value = "";
  validatedAnswer.value = null;
  selectedAnswerId.value = null;
  currentIndex.value = 0;
  questions.value = [];
  fetchQuestions(route.params.levelId, { resume: false });
};

//Determinate if the current level is the last level
const isLastLevelOfQuiz = computed(() => {
  if (levels.value.length === 0) {
    return false;
  }
  const currentLevelId = Number(route.params.levelId);
  const lastLevel = levels.value[levels.value.length - 1];
  return currentLevelId === lastLevel.level_id;
});

const levelsLoading = ref(true);
const levelsError = ref(null);

const levelsReady = computed(
  () => !levelsLoading.value && !levelsError.value && levels.value.length > 0,
);

const fetchLevels = async () => {
  levelsLoading.value = true;
  levelsError.value = null;

  try {
    const response = await fetch("http://localhost:3000/api/levels");

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!Array.isArray(data) || data.length === 0) {
      throw new Error("Inga nivåer kunde laddas.");
    }

    levels.value = data;
  } catch (err) {
    levelsError.value = err.message;
  } finally {
    levelsLoading.value = false;
  }
};

const fetchQuestions = async (
  requestedLevelId = route.params.levelId,
  { resume = true } = {},
) => {
  // Öka sekvensnumret för varje nytt anrop så att gamla, pågående anrop blir ogiltiga
  const currentSequence = ++requestSequence;

  loading.value = true;
  error.value = null;
  //Hämta ut frågans id från query-parametern om den finns, annars sätt till null
  const targetQuestionId =
    resume && route.query.questionId ? Number(route.query.questionId) : null;

  // Kontrollera att vi fortfarande är på samma nivå som när vi började hämta frågorna så att vi inte uppdaterar state med fel data om användaren navigerar bort innan fetchen är klar
  const isCurrentRequestedLevel = () =>
    String(route.params.levelId) === String(requestedLevelId);
  try {
    const response = await fetch(
      `http://localhost:3000/api/levels/${requestedLevelId}/questions`,
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    // Blanda svarsalternativen en gång per fråga när de laddas in
    // Kontrollera att vi fortfarande är på samma nivå som när vi började hämta frågorna så att vi inte uppdaterar state med fel data om användaren navigerar bort innan fetchen är klar
    if (currentSequence === requestSequence && isCurrentRequestedLevel()) {
      questions.value = data.map((q) => ({
        ...q,
        answers: [...q.answers].sort(() => Math.random() - 0.5),
      }));

      const targetIndex =
        targetQuestionId !== null
          ? questions.value.findIndex((q) => q.question_id === targetQuestionId)
          : -1;

      currentIndex.value = targetIndex >= 0 ? targetIndex : 0;
    }
  } catch (err) {
    if (currentSequence === requestSequence && isCurrentRequestedLevel())
      error.value = err.message;
  } finally {
    if (currentSequence === requestSequence && isCurrentRequestedLevel())
      loading.value = false;
  }
};

const fetchAnswerValidation = async (answerId) => {
  selectedAnswerId.value = answerId;
  const validationLevelId = route.params.levelId; // Spara nuvarande nivå när anropet startar för att säkerställa att vi inte uppdaterar state med fel data om användaren navigerar bort innan fetchen är klar

  try {
    const response = await fetch(
      `http://localhost:3000/api/answers/${answerId}/validate`,
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();

    // Kontrollera att vi är kvar på samma nivå och att samma svar fortfarande är aktivt
    if (
      String(route.params.levelId) === String(validationLevelId) &&
      selectedAnswerId.value === answerId
    ) {
      if (!result.is_correct) {
        gameOverExplanation.value = result.answer_explanation || "";
        isGameOver.value = true;
      }

      // Uppdatera current_question_id i databasen baserat på om svaret var korrekt eller inte
      //om svaret var korrekt öka currenQuestion värdet med 1, annars återställ till första frågan i nivån
      const nextQuestionId =
        questions.value[currentIndex.value + 1]?.question_id;
      const questionIdToSave = result.is_correct
        ? (nextQuestionId ?? currentQuestion.value.question_id)
        : questions.value[0].question_id;

      savingProgress.value = true; // Sätt savingProgress till true innan anropet för att undvika att användaren klickar på nästa fråga innan uppdateringen är klar

      await saveProgress(questionIdToSave);

      validatedAnswer.value = result;
    }
  } catch (err) {
    // Samma säkerhetskoll i catch-blocket så vi inte sätter felmeddelande på fel nivå
    if (
      String(route.params.levelId) === String(validationLevelId) &&
      selectedAnswerId.value === answerId
    ) {
      error.value = err.message;
    }
  }
};

const updateCurrentQuestion = async (questionId) => {
  const response = await fetch(
    "http://localhost:3000/api/users/statistics/current-question",
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("user_token")}`,
      },
      body: JSON.stringify({
        questionId: questionId,
      }),
    },
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
};

const saveProgress = async (questionId) => {
  savingProgress.value = true;
  progressError.value = null;
  pendingQuestionId.value = questionId;
  try {
    await updateCurrentQuestion(questionId);
    pendingQuestionId.value = null; // Rensa pendingQuestionId om uppdateringen lyckas
    return true; // Returnera true för att indikera att uppdateringen lyckades
  } catch (err) {
    console.error("Error saving progress:", err);
    progressError.value = `Kunde inte spara framsteg: ${err.message}`;
    return false; // Returnera false för att indikera att uppdateringen misslyckades
  } finally {
    savingProgress.value = false;
  }
};
// Funktion för att försöka spara framsteg igen
const retrySaveProgress = () => saveProgress(pendingQuestionId.value);

// Lyssna på om URL:en ändras (i detta fallnär man byter nivå)
watch(
  () => [route.params.levelId, route.query.questionId],
  ([newLevelId]) => {
    //plocka ut den nya levelId:n från route.params.levelId
    if (newLevelId) {
      validatedAnswer.value = null;
      selectedAnswerId.value = null;
      currentIndex.value = 0;
      questions.value = [];
      isLevelCompleted.value = false;
      isQuizCompleted.value = false;
      isGameOver.value = false;
      gameOverExplanation.value = "";
      progressError.value = null; // Rensa eventuella tidigare felmeddelanden
      pendingQuestionId.value = null; // Rensa pendingQuestionId när vi byter nivå
      fetchQuestions(newLevelId); // Hämta nya frågor för den nya nivån
    }
  },
);

onMounted(() => {
  fetchLevels();
  fetchQuestions();
});
</script>

<template>
  <div class="quiz-container" :id="getBackgroundId">
    <p v-if="loading || levelsLoading" class="status-msg">Laddar...</p>

    <p v-if="error" class="status-msg error">Fel: {{ error }}</p>

    <div v-if="levelsError" role="alert">
      <p class="status-msg error">
        Kunde inte ladda nivåerna: {{ levelsError }}
      </p>
      <button class="button" @click="fetchLevels">Försök igen</button>
    </div>

    <div v-if="currentQuestion && levelsReady" class="quiz-content">
      <div class="quiz-header">
        <div class="level-info">
          <p class="level-badge">Nivå: {{ currentQuestion.level_name }}</p>
          <span class="counter-text">
            Fråga {{ currentIndex + 1 }}/{{ questions.length }}
          </span>
        </div>
        <progress :value="currentIndex + 1" :max="questions.length"></progress>
      </div>

      <!-- Frågeruta -->
      <div class="question-card">
        <p class="question-subtitle">{{ currentQuestion.question_title }}</p>
        <h2 class="question-text">{{ currentQuestion.question_text }}</h2>
        <img
          v-if="currentQuestion.question_img"
          :src="currentQuestion.question_img"
          alt="Frågebild"
          class="question-img"
        />
      </div>

      <!-- Svarsalternativ -->
      <div class="answers">
        <ul>
          <li
            v-for="(answer, i) in currentQuestion.answers"
            :key="answer.answer_id"
          >
            <button
              class="button"
              :class="{
                'correct-answer':
                  validatedAnswer &&
                  answer.answer_id === selectedAnswerId &&
                  validatedAnswer.is_correct,
                'dimmed-answer':
                  validatedAnswer && answer.answer_id !== selectedAnswerId,
              }"
              @click="fetchAnswerValidation(answer.answer_id)"
              :disabled="validatedAnswer"
            >
              <span class="letter">
                <span
                  v-if="
                    validatedAnswer &&
                    answer.answer_id === selectedAnswerId &&
                    validatedAnswer.is_correct
                  "
                  >✔</span
                >
                <span v-else>{{ letters[i] }}</span>
              </span>

              <div class="answer-content">
                <span v-if="!answer.answer_img" class="answer-text">{{
                  answer.answer_text
                }}</span>
                <img
                  v-if="answer.answer_img"
                  :src="answer.answer_img"
                  :alt="answer.answer_text"
                  class="answer-img"
                />
              </div>
            </button>
          </li>
        </ul>
      </div>

      <div
        class="next-question"
        v-if="validatedAnswer && validatedAnswer.is_correct"
      >
        <div class="correct-msg">
          <h3>Rätt svar!</h3>
          <p>{{ validatedAnswer.answer_explanation }}</p>
        </div>
        <button
          v-if="!isLast"
          @click="nextQuestion"
          class="button"
          :disabled="savingProgress || progressError"
        >
          Nästa fråga
        </button>
        <button v-else @click="nextQuestion" 
        class="button"
        :disabled="savingProgress || progressError"
        >
          Slutför nivå
        </button>
      </div>
    </div>

    <LevelCompleted
      v-if="isLevelCompleted"
      :level="currentQuestion?.level_name"
      :summary="levelSummaries[currentQuestion?.level_name]"
      @next-level="nextLevel"
    />
    <QuizCompleted
      v-if="isQuizCompleted"
      :level="currentQuestion?.level_name"
      :summary="levelSummaries[currentQuestion?.level_name]"
      @first-level="firstLevel"
    />
    <GameOver
      v-if="isGameOver"
      :explanation="gameOverExplanation"
      @restart="handleRestartCurrentLevel"
    />
  </div>
</template>
