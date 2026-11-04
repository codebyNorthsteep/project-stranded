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
    aria-labelledby="quiz-info-title"
    aria-describedby="quiz-info-description"
    ref="quizInfoDialog"
    @click="onDialogClick"
  >
    <h2 class="quiz-info-title" id="quiz-info-title" aria-label="Quiz Information">
      Quiz Information
    </h2>
    <p class="quiz-info-description" id="quiz-info-description">
      Här kan du testa dina kunskaper inom överlevnad i extrema miljöer och ha
      kul samtidigt. Varje fråga har flera svarsalternativ, och du tar dig
      vidare för varje korrekt svar. Lycka till!
    </p>
    <div class="quiz-info-content">
      <h3>Så fungerar spelet:</h3>
      <ul>
        <li>
          <strong>Välj svar:</strong> Klicka på det alternativ du tror är rätt
          för att besvara frågan.
        </li>
        <li>
          <strong>Nivåer & Framsteg:</strong> Varje nivå består av ett antal
          frågor. Vid rätt svar går du vidare till nästa fråga och fyller på din
          mätare.
        </li>
        <li>
          <strong>Fel svar:</strong> Svarar du fel nollställs framsteget för
          nivån och du får börja om från nivåns första fråga.
        </li>
        <li>
          <strong>Spara framsteg:</strong> Du kan avbryta när du vill och
          använda <em>"Fortsätt nivå"</em> för att ta vid där du var senast.
        </li>
        <li>
          <strong>Lås upp & Avklara:</strong> När du klarar sista frågan i en
          nivå låses nästa nivå upp efter du har klickat på "Slutför nivå". Klarar du alla frågor i hela spelet
          markeras alla nivåer som <em>Avklarade</em>.
        </li>
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
  text-align: center;
}

.quiz-info-dialog {
  border: 1px solid var(--accent-gold);
  border-radius: 8px;
  background-color: var(--bg-dark);
  padding: 24px;
  max-width: 400px;
  width: 90%;
  max-height: 85dvh;
  margin: auto;
  color: var(--accent-gold);
  overflow-y: auto;
  font-family: 'Syne Mono', monospace;
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
  width: 100%;
  
}

h3 {
  margin: 0 0 10px;
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

.quiz-info-content ul {
  list-style-type: disc;
  padding-left: 20px;
}

.quiz-info-content li {
  margin-bottom: 10px;
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
  transition: transform 0.2s ease;
}

.info-btn:hover {
  transform: scale(1.20);
}

.button {
  height: 35px;
  padding: 0 10px;
  margin-top: 20px;
  font-family: "Syne Mono", monospace;
  color: var(--accent-gold);
  text-align: center;
}

.button:hover {
  transform: scale(1.2);
}

@media (min-width: 768px) {
  .quiz-info-dialog {
    max-width: 760px;
  }

  .quiz-info-title {
    font-size: 1.7rem;
  }
}

@media (min-width: 768px) and (max-width: 1023px) {
  .info-btn {
    width: 33px;
    height: 33px;
  }

  .info-btn p {
    font-size: 33px;
  }

  .button {
    padding: 6px 10px;
    margin-top: 0;
  }
}

@media (min-width: 1024px) {
  .info-btn {
    width: 36px;
    height: 36px;
  }

  .info-btn p {
    font-size: 36px;
  }

  .button {
    margin-top: 0;
  }
}
</style>
