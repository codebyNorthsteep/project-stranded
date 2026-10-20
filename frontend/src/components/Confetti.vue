<script setup>
import { ref, onMounted, onUnmounted, nextTick } from "vue";
import confetti from "canvas-confetti";

const props = defineProps({
  duration: {
    type: Number,
    default: 5000,
  },
});

const confettiCanvas = ref(null);
let myConfetti = null;
let animationFrameId = null;

function stopConfetti() {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }
  if (myConfetti) {
    myConfetti.reset();
  }
}

onMounted(async () => {
  
  await nextTick();

  if (confettiCanvas.value) {
    confettiCanvas.value.width = window.innerWidth;
    confettiCanvas.value.height = window.innerHeight;

    myConfetti = confetti.create(confettiCanvas.value, {
      resize: true,
      useWorker: true,
    });

    const end = Date.now() + props.duration;

    (function frame() {
      myConfetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
      });
      myConfetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
      });

      if (Date.now() < end) {
        animationFrameId = requestAnimationFrame(frame);
      }
    })();
  }
});

onUnmounted(() => {
  stopConfetti();
});
</script>

<template>
  <canvas ref="confettiCanvas" class="confetti-canvas"></canvas>
</template>

<style scoped>
.confetti-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 999;
}
</style>