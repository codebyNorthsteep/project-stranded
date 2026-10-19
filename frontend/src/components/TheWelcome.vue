<script setup>
import { ref } from "vue";
import EnvironmentCard from './EnvironmentCard.vue'

const quizImages = ref([
  {
    id: 1,
    src: "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5e/Stig_i_svensk_skog.jpg/960px-Stig_i_svensk_skog.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=thumbnail&_=20220531181304",
    alt: "Svensk Skog nivå 1",
    info: "Den svenska skogen är en av de mest artrika miljöerna i Sverige. Här finns många olika växter och djur som lever i symbios med varandra.",
    title: "Svensk Skog",
  },
  {
    id: 2,
    src: "https://betterwood.se/wp-content/uploads/2020/12/Amazonas-Peru.jpg",
    alt: "Amazonas nivå 2",
    info: "Amazonas är en av de mest artrika regioner i världen. Här finns en mängd olika växter och djur som lever i symbios med varandra.",
    title: "Amazonas",
  },
  {
    id: 3,
    src: "https://images.pexels.com/photos/1731660/pexels-photo-1731660.jpeg?cs=srgb&dl=pexels-the-trvlr-1731660.jpg&fm=jpg&_gl=1*1hnacrd*_ga*MTg0OTE1NzY4My4xNzg5NTYwMDIx*_ga_8JE65Q40S6*czE3OTE0NTk1NDQkbzMkZzEkdDE3OTE0NTk3ODMkajYwJGwwJGgw",
    alt: "Sahara Desert nivå 3",
    info: "Sahara är världens största varma öken och täcker stora delar av Nordafrika. Här finns en mängd olika växter och djur som har anpassat sig till det extrema klimatet.",
    title: "Sahara Desert",
  },
]);
</script>

<template>
  <div class="welcome">
    <p class="slogan">your knowledge is your survival tool</p>

    <div class="cards-grid">
      <EnvironmentCard
        v-for="environment in quizImages"
        :key="environment.id"
        :environment="environment"
      />
    </div>

    <div>
      <p class="description">Interactive | Adventure | Realistic</p>
    </div>

    <section class="static-window">
      <p class="description">
        Stranded är ett interaktivt äventyrsspel där du måste använda din
        kunskap för att överleva. Testa dina färdigheter och se om du kan
        överleva i olika miljöer.
      </p>
    </section> 
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

.static-window .description {
  font-size: 0.8rem;
}

.static-window {
  max-width: 850px;
  margin-inline: auto;
  padding-inline: 20px;
}

.cards-grid {
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 7px;
  padding: 20px;
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

  .static-window .description {
    font-size: 1.15rem;
  }

  .static-window{
    font-size: 0.9rem;
  }
}

@media (min-width: 1024px) {
  .cards-grid {
    gap: 25px;
    max-width: 850px;
    margin: 0 auto;
  }

  .slogan {
    font-size: 2.6rem;
  }

  .description {
    font-size: 2.6rem;
  }

  .static-window .description {
    font-size: 1.3rem;
  }
}
</style>
