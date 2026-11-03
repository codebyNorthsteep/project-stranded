const sounds = {
    correct: new Audio("/answer-sounds/correct-answer.mp3"),
    incorrect: new Audio("/answer-sounds/incorrect-answer.mp3"),
    levelFailed: new Audio("quiz-modals/defeat-music.mp3"),
    levelComplete: new Audio("quiz-modals/level-complete.mp3"),
    quizComplete: new Audio("quiz-modals/quiz-complete.mp3"),
};

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
    };
}