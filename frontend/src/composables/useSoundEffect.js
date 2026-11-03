import { ref, watch } from "vue";

const sounds = {
    correct: new Audio("/answer-sounds/correct-answer.mp3"),
    levelFailed: new Audio("/quiz-modals/level-failed.mp3"),
    levelComplete: new Audio("/quiz-modals/level-up-2.mp3"),
    quizComplete: new Audio("/quiz-modals/quiz-completed.mp3"),
};

const muted = ref(false);

watch(
    muted,
    (m) => Object.values(sounds).forEach((s) => (s.muted = m)),
    { immediate: true },
);

export function useSoundEffect() {
    const playSound = (soundName) => {
        const sound = sounds[soundName];
        if(!sound) {
            console.error(`Sound "${soundName}" not found.`);
            return;
        }
        sound.currentTime = 0; // Reset the sound to the beginning
        sound.play().catch((error) => {
            console.error(`Error playing sound "${soundName}":`, error);
        });
    };

    return {
        playSound,
        muted,
    };
}