<script setup>
import { onMounted, ref, computed } from "vue";

const loggedInUserId = ref(null);
const username = ref(); // ersätt med det faktiska användarnamnet från backend
const randomGreetings = [
  "Du överlevde till idag, grattis, {name}!",
  "Välkommen tillbaka till vildmarken, {name}!",
  "Elden är fortfarande varm, kom och sätt dig, {name}!",
  "Ännu en dag, ännu en chans att överleva, {name}!",
  "Du orienterade dig tillbaka hit, välkommen, {name}!",
  "Du hittade tillbaka, imponerande, {name}!",
  "Lägerplatsen är redo för dig, {name}!",
  "Vattnet är kokt, maten är knapp, välkommen tillbaka, {name}!",
  "Du klarade natten, bra jobbat, {name}!",
  "Redo för nästa expedition, {name}?",
  "Skogen mörknar, men du är tillbaka, {name}!",
  "Lägerplatsen är redo, {name}!",
  "Hur länge klarar du dig i vildmarken, {name}?",
];

const greetingTemplate =
  randomGreetings[Math.floor(Math.random() * randomGreetings.length)];

const greetingParts = computed(() => {
  const [before, after] = greetingTemplate.split("{name}");
  return { before, after };
});

const getLoggedInUsername = async (userId) => {
  fetch(`http://localhost:3000/api/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("user_token")}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      username.value = data.username;
    })
    .catch((error) => {
      console.error("Error fetching user info:", error);
    });
};

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
    <h2>
      {{ greetingParts.before
      }}<span class="username-highlight">{{ username || "Användare" }}</span
      >{{ greetingParts.after }}
    </h2>
    <p>
      Här är din översikt där du kan följa din statistik, se dina framsteg och
      hoppa direkt in i nästa quiz.
    </p>
    <p>
      Behöver du en paus kan du när som helst
      lämna ett pågående quiz och fortsätta där du slutade. 
  </p>
  </div>
</template>
