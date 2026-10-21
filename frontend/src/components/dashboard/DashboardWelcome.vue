<script setup>
import { onMounted, ref} from "vue";

const loggedInUserId = ref(null);
const username = ref(); // ersätt med det faktiska användarnamnet från backend

const getLoggedInUsername = async (userId) =>{
fetch(`http://localhost:3000/api/users/${userId}`, {
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
    loggedInUserId.value = JSON.parse(localStorage.getItem("user"))?.id;
    if (loggedInUserId.value) {
        getLoggedInUsername(loggedInUserId.value);
    } else {
        username.value = "Användare"; // Default value if user is not logged in
    }
});
</script>

<template>
<div class="dashboard-welcome">
      <h2>Välkommen tillbaka, <span class="username-highlight">{{ username || 'Användare' }}</span>! 👋</h2>
      <p>Här är din översikt där du kan följa din statistik, se dina framsteg och hoppa direkt in i nästa quiz.</p>
    </div>
</template>