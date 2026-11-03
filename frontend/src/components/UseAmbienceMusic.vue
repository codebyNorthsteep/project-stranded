<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from "vue";

const props = defineProps({ src: String });

const audio = new Audio();
audio.loop = true;

const isPlaying = ref(false);
const muted = ref(false);

async function play() {
  try {
    await audio.play();
    isPlaying.value = true;
  } catch {
    isPlaying.value = false; // autoplay blockerad
  }
}

function toggle() {
  if (isPlaying.value) {
    audio.pause();
    isPlaying.value = false;
  } else {
    play();
  }
}

watch(muted, (m) => (audio.muted = m));

// byter låt när src ändras
watch(
  () => props.src,
  (src) => {
    if (!src) return;
    audio.src = src;
    play();
  },
  { immediate: true },
);

onBeforeUnmount(() => audio.pause());
</script>

<template>
  <div class="music-player" role="group" aria-label="Ambience controls">
    <button
      type="button"
      @click="toggle"
      :aria-label="isPlaying ? 'Pause ambience' : 'Play ambience'"
      :title="isPlaying ? 'Pause ambience' : 'Play ambience'"
    >
      <span aria-hidden="true">{{ isPlaying ? "⏸" : "▶" }}</span>
    </button>

    <button
      type="button"
      @click="muted = !muted"
      :aria-label="muted ? 'Unmute ambience' : 'Mute ambience'"
      :title="muted ? 'Unmute ambience' : 'Mute ambience'"
    >
      <span aria-hidden="true">{{ muted ? "🔇" : "🔊" }}</span>
    </button>
  </div>
</template>
<style scoped>
.music-player {
  position: fixed;
  bottom: 1.25rem;
  right: 1.25rem;
  z-index: 100;

  display: flex;
  gap: 0.5rem;
  padding: 0.5rem;

  background: rgba(20, 20, 20, 0.45);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 999px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
}

.music-player button {
  width: 2.5rem;
  height: 2.5rem;
  padding: 0;

  display: grid;
  place-items: center;

  font-size: 1.1rem;
  line-height: 1;
  color: #fff;

  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 50%;
  cursor: pointer;

  transition: background 0.2s, transform 0.15s;
}

.music-player button:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: scale(1.08);
}

.music-player button:active {
  transform: scale(0.95);
}

.music-player button:focus-visible {
  outline: 2px solid #fff;
  outline-offset: 2px;
}
</style>