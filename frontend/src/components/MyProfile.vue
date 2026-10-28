<script setup>
import { ref, onMounted } from "vue";
import Logout from "../components/Logout.vue";

const props = defineProps({
  username: { type: String, required: false },
  picture: { type: String, required: false },
});

const user = ref({
  username: "",
  picture: "",
});

const errorMessage = ref("");
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
const token = localStorage.getItem("user_token");
const userId = localStorage.getItem("userId");

async function myProfile() {
  try {
    const response = await fetch(`${apiBaseUrl}/api/users/${userId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      user.value = data;
    } else {
      errorMessage.value = "Error getting user information";
    }
  } catch (error) {
    errorMessage.value = error.message;
  }
}

async function updateProfile(updateData) {
  try {
    const response = await fetch(`${apiBaseUrl}/api/users/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedData),
    });

    if (response.ok) {
      console.log("Profile updated successfully");
      myProfile();
    } else {
      const err = await response.json();
      alert(`Error: ${err.error || "It could not update"}`);
    }
  } catch (error) {
    errorMessage.value = error.message;
  }
}

const promptUpdateUsername = () => {
  const newUsername = prompt("Enter new username:", user.value.username);
  if (newUsername) updateProfile({ username: newUsername });
};

const promptUpdatePassword = () => {
  const newPassword = prompt("Enter new password:");
  if (newPassword) updateProfile({ password: newPassword });
};

const promptUpdatePicture = () => {
  const newPicture = prompt("Enter new picture URL:", user.value.user_img);
  if (newPicture) updateProfile({ picture: newPicture });
};

onMounted(() => {
  if (userId && token) {
    myProfile();
  }
});
</script>

<template>
  <div class="my-profile-container">

    <div class="my-profile-picture">
      <div class="picture-wrapper">
        <img
          :src="user?.user_img || props.user_img"
          alt="userPicture"
          class="avatar-img"
        />
        <button class="button" @click="promptUpdatePicture">📷</button>
      </div>
    </div>

    <div class="my-profile-username">
      <h3>{{ user?.username || props.username }}</h3>
    </div>

    <div class="options-list">
      <div class="option-card" @click="promptUpdateUsername">
        <span class="icon">👤</span>
        <span>Change username</span>
        <span class="arrow">›</span>
      </div>

      <div class="option-card" @click="promptUpdatePassword">
        <span class="icon">🔒</span>
        <span>Change password</span>
        <span class="arrow">›</span>
      </div>

      <div class="option-card" @click="handleDeleteAccount">
        <span class="icon">🗑️</span>
        <span>Delete account</span>
        <span class="arrow">›</span>
      </div>
    </div>
  </div>
</template>

<style scoped>

.profile-container {
  display: flex;
  justify-content: center;
  background-color: var(--bg-dark);
  color: var(--accent-gold);
  min-height: 100vh;
  padding: 24px;
  max-width: 500px;
  margin: 0 auto;
}

.my-profile-picture {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.picture-wrapper {
  position: relative;
  width: 90px;
  height: 90px;
}

.avatar-img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--accent-gold);
}

.button {
    border-radius: 100px;
}

.my-profile-username {
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 30px;
}

.options-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 30px;
}

.option-card {
  background-color: var(--bg-dark);
  border: 1px solid var(--border-color);
  padding: 14px 16px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  transition: border-color 0.2s;
}

.option-card:hover {
  border-color: var(--accent-gold);
}

.icon {
  margin-right: 10px;
}

</style>
