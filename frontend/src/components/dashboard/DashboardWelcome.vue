<script setup>
import { onMounted, ref, computed } from "vue";

const loggedInUserId = ref(null);
const username = ref(); // ersätt med det faktiska användarnamnet från backend
const firstTimeGreetings = [
  "Välkommen till vildmarken, {name}! Din expedition börjar nu.",
  "Första dagen i skogen, {name}! Vi hoppas att du har packat rätt.",
  "Ny överlevare på lägret, {name}! Låt oss se vad du går för.",
  "Du har tagit dina första steg, {name}! Nu börjar äventyret.",
];

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

// Hjälpfunktion för att slumpa fram ett meddelande
const pick = (list) => list[Math.floor(Math.random() * list.length)];

// Välj ett slumpmässigt meddelande från listan med hälsningar
const greetingTemplate = ref(pick(randomGreetings));

const getLoggedInUsername = async (userId) => {
  try {
    const token = localStorage.getItem("user_token");
    if (!token) return;

    const response = await fetch(
      `http://localhost:3000/api/users/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error(`User request failed: ${response.status}`);
    }

    const data = await response.json();
    username.value = data.username || "Användare";
  } catch (error) {
    console.error("Error fetching user info:", error);
  }
};

onMounted(() => {
  username.value = "Användare";

  try {
    const storedUser = localStorage.getItem("user");
    loggedInUserId.value = JSON.parse(storedUser)?.id ?? null;
  } catch (error) {
    console.warn("Could not read stored user:", error);
  }

  if (!loggedInUserId.value) return;

  try {
    const key = `dashboardVisited_${loggedInUserId.value}`;

    if (!localStorage.getItem(key)) {
      greetingTemplate.value = pick(firstTimeGreetings);
      localStorage.setItem(key, "true");
    }
  } catch (error) {
    console.warn("Could not read or save dashboard visit:", error);
  }

  // Visit tracking must not prevent the username request.
  getLoggedInUsername(loggedInUserId.value);
});

const greetingParts = computed(() => {
  const [before, after] = greetingTemplate.value.split("{name}");
  return { before, after };
});
</script>

<template>
  <div class="dashboard-welcome">
    <div class="welcome">
    <h2>
      {{ greetingParts.before
      }}<span class="username-highlight">{{ username || "Användare" }}</span
      >{{ greetingParts.after }}
    </h2>
    </div>
    <div class="info-text-box">
      <p>
        Här är din översikt där du kan följa din statistik, se dina framsteg och
        hoppa direkt in i nästa quiz.
      </p>
    </div>
    <div class="info-text-box">
      <p>
        Behöver du en paus kan du när som helst lämna ett pågående quiz och
        fortsätta där du slutade.
      </p>
    </div>
  </div>
</template>
