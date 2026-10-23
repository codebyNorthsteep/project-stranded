<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { decodeCredential } from "vue3-google-login";

const router = useRouter();
const errorMessage = ref("");

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

// This callback will be triggered when the user selects or login to
// his Google account from the popup
const callback = async (googleResponse) => {
  try {
    //1. First we use DecodeCredential which will retrive the JWT payload from the credential
    const googleData = decodeCredential(googleResponse.credential);

    //2. We map the google fields to the structure we use in our database
    const user = {
      username:
        googleData.given_name ||
        googleData.name ||
        googleData.email.split("@")[0],
      email: googleData.email,
    }; //add later picture: googleData.picture for my profile

    //3. Send the request to our endpoint
    const apiResponse = await fetch(`${apiBaseUrl}/api/login/google`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: user.username,
        email: user.email,
      }),
    });

    const data = await apiResponse.json();

    if (!apiResponse.ok) {
      throw new Error(
        data.message || data.error || "Misslyckades att logga in med Google",
      );
    }

    //4. We store the JWT received from Google as the primary session token
    localStorage.setItem("user_token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    //5. Redirect to dashboard
    router.push("/dashboard");
  } catch (error) {
    console.error("Google login error:", error);
    errorMessage.value = error.message;
  }
};
</script>

<template>
  <div class="social-button-container">
    <p>eller</p>
    <div class="google-button-wrapper">
      <GoogleLogin :callback="callback" prompt auto-login />
    </div>
    <p v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </p>
  </div>
</template>

<style scoped>
.social-button-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 8px;
}

.google-button-wrapper {
  transform: scale(0.85);
  transform-origin: center; 
}

p {
  font-size: 0.8rem;
  margin-top: 10px;
  margin-bottom: 10px;
}

.error-message {
  color: red;
  font-size: 0.8rem;
  margin: 0;
  text-align: center;
}

@media (min-width: 768px) and (max-width: 1023px) {
  p {
    font-size: 1.15rem;
  }
}

@media (min-width: 1024px) {
  p {
    font-size: 1.3rem;
  }
}
</style>
