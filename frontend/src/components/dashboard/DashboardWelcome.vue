<script setup>
import { onMounted, ref} from "vue";

const username = ref(); // ersätt med det faktiska användarnamnet från backend

const getLoggedInUsername = async () =>{
fetch(`http://localhost:3000/api/users/${JSON.parse(localStorage.getItem("user"))?.id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("user_token")}`,
    },
  })
  .then(response => response.json())
  .then(data => {
    username.value = data.username;
  })
  .catch(error => {
    console.error('Error fetching user info:', error);
  });
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