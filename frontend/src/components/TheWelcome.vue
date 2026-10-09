<script setup>
import { ref } from "vue";

const quizImages = ref([
  {
    id: 1,
    src: "https://images.pexels.com/photos/7341995/pexels-photo-7341995.jpeg?cs=srgb&dl=pexels-l-a-17372988-7341995.jpg&fm=jpg&w=2736&h=3648&_gl=1*8cglxj*_ga*MTg0OTE1NzY4My4xNzg5NTYwMDIx*_ga_8JE65Q40S6*czE3OTE0NTk1NDQkbzMkZzAkdDE3OTE0NTk1NDQkajYwJGwwJGgw",
    alt: "Svensk Skog nivå 1",
  },
  {
    id: 2,
    src: "https://betterwood.se/wp-content/uploads/2020/12/Amazonas-Peru.jpg",
    alt: "Amazonas nivå 2",
  },
  {
    id: 3,
    src: "https://images.pexels.com/photos/1731660/pexels-photo-1731660.jpeg?cs=srgb&dl=pexels-the-trvlr-1731660.jpg&fm=jpg&_gl=1*1hnacrd*_ga*MTg0OTE1NzY4My4xNzg5NTYwMDIx*_ga_8JE65Q40S6*czE3OTE0NTk1NDQkbzMkZzEkdDE3OTE0NTk3ODMkajYwJGwwJGgw",
    alt: "Sahara Desert nivå 3",
  },
]);
</script>

<template>
  <div class="welcome">
    <p class="slogan">your knowledge is your survival tool</p>

    <div class="cards-grid">
      <div v-for="image in quizImages" :key="image.id" class="card">
        <img :src="image.src" :alt="image.alt" class="card-image" />
      </div>
    </div>

    <div>
      <p class="description">Interactive | Adventure | Realistic</p>
    </div>
  </div>
</template>

<style scoped>
.slogan {
  text-align: center;
  font-size: 1.1rem;
  margin-bottom: 20px;
  margin-top: 20px;
}

.description {
  text-align: center;
  font-size: 1.1rem;
  margin-top: 20px;
  margin-bottom: 40px;
}

.cards-grid {
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 7px;
  padding: 20px;
}

.card {
  flex: 1;
  border: 1.5px solid var(--accent-gold);
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgb(0, 0, 0.1);
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

@media (min-width: 768px) and (max-width: 1023px) {
  .cards-grid {
    gap: 22px;
  }

  .slogan {
    font-size: 2rem;
  }

  .description {
    font-size: 2rem;
  }
}

@media (min-width: 1024px) {
  .cards-grid {
    gap: 25px;
    max-width: 850px;
    margin: 0 auto;
  }

  .card {
    height: 400px;
  }

  .slogan {
    font-size: 2.6rem;
  }

  .description {
    font-size: 2.6rem;
  }
}
</style>
