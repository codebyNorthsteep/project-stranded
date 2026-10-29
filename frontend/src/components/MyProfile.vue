<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import Logout from "../components/Logout.vue";

const props = defineProps({
  username: { type: String, required: false },
  user_img: { type: String, required: false },
});

const user = ref({
  username: "",
  user_img: "",
});
const router = useRouter();
const errorMessage = ref("");
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
const token = localStorage.getItem("user_token");
const userStorage = JSON.parse(localStorage.getItem("user") || "{}");
const userId = userStorage.id;
const successMessage = ref("");

const updateUsername = () => {
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

const handleDeleteAccount = () => {
  const confirmation = confirm(
    "Är du säker på att du vill ta bort ditt konto? Det går inte att ångra",
  );
  if (!confirmation) return;
  deleteAccount();
};

async function openModal(action) {
  activeAction.value = action;
  await nextTick();
  dialogRef.value?.showModal(); 
}

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
      user.value = {
        ...data,
        user_img: data.user_img || data.picture,
      };
    } else {
      errorMessage.value = "Fel vid hämtning av användarinformation";
    }
  } catch (error) {
    errorMessage.value = error.message;
  }
}

async function updateProfile(updateData) {
  errorMessage.value = "";
  successMessage.value = "";

  try {
    const response = await fetch(`${apiBaseUrl}/api/users/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updateData),
    });

    const data = await response.json();

    if (response.ok) {
      console.log("Profile updated successfully");

      if (updateData.password) {
        successMessage.value = "Lösenordet har uppdaterats!";
      } else if (updateData.username) {
        successMessage.value = "Användarnamnet har uppdaterats!";
      } else if (updateData.picture) {
        successMessage.value = "Profilbilden har uppdaterats!";
      } else {
        successMessage.value =
          typeof data === "string" ? data : "Profilen har uppdaterats!";
      }

      myProfile();
    } else {
      errorMessage.value = data.error || "Det gick inte att uppdatera profilen";
    }
  } catch (error) {
    errorMessage.value = error.message;
  }
}

async function deleteAccount() {
  try {
    const response = await fetch(`${apiBaseUrl}/api/users/${userId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      localStorage.removeItem("user_token");
      localStorage.removeItem("user");
      console.log("Profile deleted successfully");
      router.push("/");
    } else {
      const err = await response.json();
      errorMessage.value = "Kontot kunde inte raderas";
    }
  } catch (error) {
    errorMessage.value = error.message;
  }
}

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
          :src="
            user?.user_img ||
            props.user_img ||
            '/src/Assets/images/Default-profile-picture.png'
          "
          alt="userPicture"
          class="user-picture"
        />
        <button
          class="button button-update-picture"
          @click="promptUpdatePicture"
        >
          📷
        </button>
      </div>
    </div>

    <div class="my-profile-username">
      <h3>{{ user?.username || props.username }}</h3>
    </div>

    <div class="options-list">
      <button type="button" class="button option-card" @click="openModal('username')">👤 Ändra användarnamn ›</button>
      <button type="button" class="button option-card" @click="openModal('password')">🔒 Ändra lösenord ›</button>
      <button type="button" class="button option-card" @click="openModal('username')">🗑️ Ta bort konto ›</button>
    </div>

    <dialog
      ref="optionListDialog"
      class="option-list-dialog"
      closedby="none"
      @keydown.esc.prevent.stop
      @cancel.prevent
    >
      <form @submit.prevent="updateSubmit" novalidate>
        <div v-if="activeAction === username" class="field">
          <label for="username" class="form-label">Användarnamn</label>
          <input
            id="username"
            v-model="form.username"
            type="text"
            name="username"
            class="form-control"
            required
          />
          <p v-if="formErrors.username" class="error-message">
            {{ formErrors.username }}
          </p>
          <p v-if="successMessage" class="success-message" role="status">
            {{ successMessage }}
          </p>
        </div>

        <div v-if="activeAction === password" class="field">
          <label for="password" class="form-label">Lösenord</label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            name="password"
            class="form-control"
            required
          />
          <p v-if="formErrors.password" class="error-message">
            {{ formErrors.password }}
          </p>
          <p v-if="successMessage" class="success-message" role="status">
            {{ successMessage }}
          </p>
        </div>

        <div class="button dialog-button">
          <button type="button" @click="closeModal">Avbryt</button>
          <button type="submit">Spara</button>
        </div>
      </form>
    </dialog>
  </div>
</template>

<style scoped>
.profile-container {
  display: flex;
  flex-direction: column;
  align-items: center;
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
  margin-top: 20px;
}

.picture-wrapper {
  position: relative;
  width: 90px;
  height: 90px;
}

.button-update-picture {
  position: absolute;
  bottom: -9px;
  right: -7px;
  padding: 5px 7px;
}

.user-picture {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--accent-gold);
}

.my-profile-username {
  text-align: center;
  font-size: 0.8rem;
  font-weight: bold;
  margin-bottom: 20px;
  color: var(--accent-gold);
}

.options-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 30px;
  align-items: center;
}

.option-card {
  padding: 8px 12px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  transition: border-color 0.2s;
  font-size: 0.8rem;
  width: 85%;
  max-width: 250px;
}

.option-card:hover {
  border-color: var(--accent-gold);
}

.icon {
  margin-right: 10px;
}

.error-message {
  color: red;
  font-size: 0.8rem;
  justify-content: center;
  text-align: center;
  margin-bottom: 20px;
}

.success-message {
  font-size: 0.8rem;
  justify-content: center;
  text-align: center;
  margin-bottom: 20px;
}
</style>
