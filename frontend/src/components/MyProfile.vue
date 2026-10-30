<script setup>
import { ref, onMounted, nextTick } from "vue";
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
const isSubmitting = ref(false);
let profileIsCurrent = false;
let profileRequestVersion = 0;

const optionListDialog = ref(null);
const activeAction = ref(null);

const form = ref({
  username: "",
  password: "",
  confirmPassword: "",
  picture: "",
});

const handleDeleteAccount = () => {
  const confirmation = confirm(
    "Är du säker på att du vill ta bort ditt konto? Det går inte att ångra",
  );
  if (!confirmation) return;
  deleteAccount();
};

async function openModal(action) {
  if (isSubmitting.value) return;

  activeAction.value = action;
  errorMessage.value = "";
  successMessage.value = "";

  if (action === "username") {
    form.value.username = user.value.username || "";
  } else if (action === "picture") {
    form.value.picture = user.value.user_img || "";
  } else {
    form.value.password = "";
    form.value.confirmPassword = "";
  }

  await nextTick();
  optionListDialog.value?.showModal();
}

function closeModal() {
  if (isSubmitting.value) return;

  optionListDialog.value?.close();
  activeAction.value = null;
}

function normalizePictureUrl(value) {
  try {
    const url = new URL(value.trim());
    return url.protocol === "http:" || url.protocol === "https:"
      ? url.href
      : null;
  } catch {
    return null;
  }
}

async function updateSubmit() {
  if (isSubmitting.value || successMessage.value) return;

  isSubmitting.value = true;

  try {
    if (activeAction.value === "username") {

      // Ensure that the new username is not the same as the current username
      const currentUsername = user.value?.username;
      if (
        profileIsCurrent &&
        typeof currentUsername === "string" &&
        currentUsername.trim() &&
        form.value.username.trim() === currentUsername.trim()
      ) {
        errorMessage.value = "Ange ett ny användarnamn";
        return;
      }
      await updateProfile({ username: form.value.username });

      // Ensure that the new password and confirm password match
    } else if (activeAction.value === "password") {
      if (form.value.password !== form.value.confirmPassword) {
        errorMessage.value = "Lösenorden matchar inte";
        return;
      }
      await updateProfile({ password: form.value.password });

    } else if (activeAction.value === "picture") {

      const currentPicture = normalizePictureUrl(user.value?.user_img || "");
      const submittedPicture = normalizePictureUrl(form.value.picture);
      if (profileIsCurrent && currentPicture && currentPicture === submittedPicture) {
        errorMessage.value = "Ladda upp en ny bild";
        return;
      }

      await updateProfile({ picture: form.value.picture });

    } else if (activeAction.value === "delete") {
      await deleteAccount();
    }
  } finally {
    isSubmitting.value = false;
  }
}

async function myProfile() {
  const requestVersion = ++profileRequestVersion;
  profileIsCurrent = false;

  try {
    const response = await fetch(`${apiBaseUrl}/api/users/${userId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      if (requestVersion === profileRequestVersion) {
        user.value = {
          ...data,
          user_img: data.user_img || data.picture,
        };
        profileIsCurrent = true;
      }
    } else if (requestVersion === profileRequestVersion) {
      errorMessage.value = "Fel vid hämtning av användarinformation";
    }
  } catch (error) {
    if (requestVersion === profileRequestVersion) {
      errorMessage.value = error.message;
    }
  }
}

async function updateProfile(updateData) {
  errorMessage.value = "";
  successMessage.value = "";
  profileIsCurrent = false;
  profileRequestVersion++;

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

      await myProfile();
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
          type="button"
          class="button button-update-picture"
          @click="openModal('picture')"
          aria-label="Ändra profilbild"
        >
          📷
        </button>
      </div>
    </div>

    <div class="my-profile-username">
      <h3>{{ user?.username || props.username }}</h3>
    </div>

    <div class="options-list">
      <button
        type="button"
        class="button option-card"
        @click="openModal('username')"
      >
        <div class="icon">👤</div>
        <div class="text">Ändra användarnamn</div>
        <div class="arrow">›</div>
      </button>
      <button
        type="button"
        class="button option-card"
        @click="openModal('password')"
      >
        <div class="icon">🔒</div>
        <div class="text">Ändra lösenord</div>
        <div class="arrow">›</div>
      </button>
      <button
        type="button"
        class="button option-card"
        @click="openModal('delete')"
      >
        <div class="icon">🗑️</div>
        <div class="text">Ta bort konto</div>
        <div class="arrow">›</div>
      </button>
    </div>

    <dialog
      ref="optionListDialog"
      aria-labelledby="option-list-dialog"
      class="option-list-dialog"
      closedby="none"
      @keydown.esc.prevent.stop
      @cancel.prevent
    >
      <form @submit.prevent="updateSubmit" novalidate>
        <div v-if="activeAction === 'username'" class="field">
          <label for="username" class="form-label"
            >Ange det nya användarnamnet</label
          >
          <input
            id="username"
            v-model="form.username"
            type="text"
            name="username"
            class="form-control"
            :readonly="isSubmitting || successMessage !== ''"
            required
          />
          <div v-if="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>
          <div v-if="successMessage" class="success-message" role="status">
            {{ successMessage }}
          </div>
        </div>

        <div v-if="activeAction === 'password'" class="field">
          <label for="password" class="form-label"
            >Ange det nya lösenordet</label
          >
          <input
            id="password"
            v-model="form.password"
            type="password"
            name="password"
            class="form-control"
            :readonly="isSubmitting || successMessage !== ''"
            required
          /><br />

          <label for="confirmPassword" class="form-label"
            >Bekräfta lösenord</label
          >
          <input
            id="confirmPassword"
            v-model="form.confirmPassword"
            type="password"
            name="confirmPassword"
            class="form-control"
            :readonly="isSubmitting || successMessage !== ''"
            required
          />

          <div v-if="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>
          <div v-if="successMessage" class="success-message" role="status">
            {{ successMessage }}
          </div>
        </div>

        <div v-if="activeAction === 'picture'" class="field">
          <label for="picture" class="form-label">Bild URL</label>
          <input
            id="picture"
            v-model="form.picture"
            type="url"
            name="picture"
            class="form-control"
            :readonly="isSubmitting || successMessage !== ''"
            required
          />

          <div v-if="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>
          <div v-if="successMessage" class="success-message" role="status">
            {{ successMessage }}
          </div>
        </div>

        <div v-if="activeAction === 'delete'" class="field">
          <h3>Radera konto ⚠️</h3>
          <br />
          <p class="warning-text">
            Är du säker på att du vill ta bort ditt konto? Det går inte att
            ångra.
          </p>

          <div v-if="errorMessage" class="error-message" role="alert">
            {{ errorMessage }}
          </div>
        </div>

        <div class="modal-button-container">
          <button
            type="button"
            class="button modal-button"
            @click="closeModal"
            v-if="!successMessage"
            :disabled="isSubmitting"
          >
            Avbryt
          </button>
          <button
            type="submit"
            class="button modal-button"
            v-if="!successMessage"
            :disabled="isSubmitting || successMessage !== ''"
          >
            {{ activeAction === "delete" ? "Radera konto" : "Spara" }}
          </button>
          <button
            type="button"
            class="button modal-button"
            @click="closeModal"
            v-if="successMessage !== ''"
          >
            Gå tillbaka
          </button>
        </div>
      </form>
    </dialog>
  </div>
</template>

<style scoped>
.option-list-dialog[open] {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.option-list-dialog {
  border: 1px solid var(--accent-gold);
  border-radius: 8px;
  background-color: var(--bg-dark);
  padding: 24px;
  max-width: 400px;
  width: 90%;
  margin: auto;
  color: var(--accent-gold);
  overflow: visible;
}

.option-list-dialog::backdrop {
  background-color: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(2px);
}

.my-profile-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  box-sizing: border-box;
  overflow-y: auto;
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
  gap: 18px;
  margin-bottom: 30px;
  align-items: center;
  width: 100%;
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
  width: 90%;
  max-width: 350px;
}

.option-card:hover {
  border-color: var(--accent-gold);
}

form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  max-width: 220px;
}

.field {
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
}

.form-label {
  font-size: 0.9rem;
  margin-bottom: 15px;
}

.modal-button-container {
  display: flex;
  justify-content: space-evenly;
  background: none;
}

.form-control {
  width: 100%;
  padding: 4px;
  font-size: 0.8rem;
  border-radius: 4px;
  border: 1px solid #ccc;
  box-sizing: border-box;
}

.form-control:focus {
  outline: 1px solid var(--accent-gold);
  border-color: var(--accent-gold);
}

.error-message {
  color: red;
  font-size: 0.8rem;
  justify-content: center;
  text-align: center;
  margin-top: 15px;
}

.success-message {
  font-size: 0.8rem;
  justify-content: center;
  text-align: center;
  margin-top: 15px;
}

@media (min-width: 768px) {
  .my-profile-username {
    font-size: 1.3rem;
    margin-top: 10px;
    margin-bottom: 30px;
  }

  .option-card {
    max-width: 350px;
    padding: 16px 20px;
    font-size: 1.2em;
  }

  .picture-wrapper {
    margin-top: 20px;
    width: 130px;
    height: 130px;
  }

  .button-update-picture {
    bottom: -5px;
    right: -9px;
    padding: 8px 10px;
  }

  .option-list-dialog {
    max-width: 500px;
    height: 350px;
  }

  form {
    max-width: 350px;
    gap: 30px;
  }

  .form-label {
    font-size: 1.3rem;
    margin-bottom: 20px;
  }

  .form-control {
    padding: 5px;
    font-size: 1rem;
    max-width: 300px;
  }

  .modal-button-container {
    flex-direction: row;
    gap: 25px;
    justify-content: center;
  }

  .modal-button {
    padding: 8px 20px;
    font-size: 1rem;
    text-align: center;
  }

  .warning-text {
    font-size: 1.2rem;
  }

  .error-message {
    font-size: 1.1rem;
  }

  .success-message {
    font-size: 1.1rem;
    margin-top: 30px;
  }
}
</style>
