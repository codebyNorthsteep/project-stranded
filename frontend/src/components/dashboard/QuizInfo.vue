<script setup>
import { ref } from "vue";

const quizInfoDialog = ref(null);

const open = () => quizInfoDialog.value?.showModal();
const close = () => quizInfoDialog.value?.close();

const onDialogClick = (event) => {
  if (event.target === quizInfoDialog.value) {
    close();
  }
};
</script>
<template>
  <button
    class="info-btn"
    @click="open"
    aria-label="Open quiz information dialog"
  >
    <p>&#8505;</p>
  </button>
  <dialog
    class="quiz-info-dialog"
    id="quiz-info-dialog"
    ref="quizInfoDialog"
    @click="onDialogClick"
  >
    <h2 class="quiz-info-title">Quiz Information</h2>
    <p class="quiz-info-description">
      Här kan du testa dina kunskaper inom överlevnad
      i extrema miljöer och ha kul samtidigt. Varje fråga har flera
      svarsalternativ, och du tar dig vidare för varje korrekt svar. Lycka till!
    </p>
<div class="quiz-info-content">
      <h3>Instruktioner:</h3>
      <ul>
        <li><strong>Svara på frågor:</strong> Välj det alternativ du tror är rätt.</li>
        <li><strong>Framsteg:</strong> Klarar du frågan kommer du vidare.</li>
        <li><strong>Fel svar:</strong> Om det blir fel nollställs nivån och du får en ny chans från början av den nivån.</li>
        <li><strong>Mål:</strong> Klarar du alla frågor avklaras nivån. Lycka till!</li>
      </ul>
    </div>
    <button class="button" @click="close">Stäng</button>
  </dialog>
</template>
<style scoped>
.quiz-info-dialog[open] {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.quiz-info-dialog {
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

.quiz-info-dialog::backdrop {
  background-color: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(2px);
}

.quiz-info-title {
  font-size: 1.6rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--accent-gold);
  width: 100%;
}

h3 {
  margin: 0 0 10px;
  color: var(--accent-gold);
}

.quiz-info-content {
  margin-top: 15px;
  text-align: left;
  margin: 20px 0;
  border: 3px solid var(--border-color);
  border-radius: 10px;
  padding: 20px;
  letter-spacing: 0.08em;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.8);
}

.quiz-info-description {
  margin: 16px 0 0;
  line-height: 1.6;
  opacity: 0.9;
}

.info-btn {
  margin-top: 20px;
  padding: 4px 10px;
  background: none;
  border: none;
  color: var(--accent-gold);
  font-size: 24px;
  line-height: 1;
  cursor: pointer;
}

.button {
  height: 35px;
  padding: 0 10px;
  margin-top: 20px;
  font-family: "Syne Mono", monospace;
  color: var(--accent-gold);
  text-align: center;
}



@media (min-width: 768px) {
  .quiz-info-dialog {
     max-width: 760px;
  }

  .quiz-info-dialog-title {
    font-size: 1.7rem;
  }
}

@media (min-width: 768px) and (max-width: 1023px) {
  .info-btn {
    width: 31px;
    height: 28px;
  }

    .info-btn p {
    font-size: 28px;
  }

  .button {
    padding: 6px 10px;
    margin-top: 0;
  }
}

@media (min-width: 1024px) {
  .info-btn {
    width: 33px;
    height: 30px;
  }

  .info-btn p {
    font-size: 30px;
  }

  .button {
    margin-top: 0;
  }
}
</style>
