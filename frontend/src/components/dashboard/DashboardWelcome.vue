<script setup>
import { onMounted, ref} from "vue";

const username = ref(); // ersätt med det faktiska användarnamnet från backend

const getLoggedInUsername = async () =>{

}

onMounted(() => {
    getLoggedInUsername();
});
</script>

<template>
    <div class="dashboard-welcome">
      <h1>Välkommen, {{ username }}!</h1>
      <p>Här är din dashboard där du kan se din statistik och framsteg.</p>
    </div>
</template>