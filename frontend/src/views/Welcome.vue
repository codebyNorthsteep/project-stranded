<script setup>

</script>

<template>

    <header>
        <h3 class="slogan"> your knowledge is your survival tool </h3>
    </header>

    <section class="cards-grid">
        <div 
            v-for="image in quizImages" 
            :key="image.id" 
            class="card">
            <img :src="image.src" :alt="image.alt" class="card-image" />
        </div>
    </section>
    
    <div> 
        <p class="description"> Interactive | Adventure | Realistic </p>
    </div>

    <section>
        <p>Log in to start your journey</p>
        <router-link to="/login" class="btn"> log in </router-link>
        <p> or register </p>
        <router-link to="/register" class="btn"> register </router-link>
    </section>

</template>