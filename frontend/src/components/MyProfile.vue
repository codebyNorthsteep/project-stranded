<script setup>
import { computed, nextTick, ref, onMounted } from "vue";
import { useRouter } from "vue-router";

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

const profileDialog = ref(null);
const activeAction = ref(null);
const formValue = ref("");
const dialogError = ref("");
const isSubmitting = ref(false);
let triggerButton = null;

const actionLabels = {
  username: "Ändra användarnamn",
  password: "Ändra lösenord",
  picture: "Ändra profilbild",
  delete: "Ta bort konto",
};
const dialogTitle = computed(() => actionLabels[activeAction.value]);
const inputLabel = computed(() => ({
  username: "Användarnamn",
  password: "Nytt lösenord",
  picture: "Bildens URL",
})[activeAction.value]);
const inputType = computed(() => ({
  username: "text",
  password: "password",
  picture: "url",
})[activeAction.value]);

async function openDialog(action, event) {
  if (isSubmitting.value) return;
  triggerButton = event.currentTarget;
  activeAction.value = action;
  dialogError.value = "";
  formValue.value = action === "username"
    ? user.value.username || props.username || ""
    : action === "picture"
      ? user.value.user_img || props.user_img || ""
      : "";
  await nextTick();
  profileDialog.value.showModal();
}

function closeDialog() {
  profileDialog.value.close();
}

function handleDialogClose() {
  formValue.value = "";
  dialogError.value = "";
  activeAction.value = null;
  triggerButton?.focus({ preventScroll: true });
  triggerButton = null;
}

async function submitDialog() {
  if (isSubmitting.value || !activeAction.value) return;
  dialogError.value = "";
  const action = activeAction.value;
  const value = action === "password" ? formValue.value : formValue.value.trim();
  if (action !== "delete" && !value) {
    dialogError.value = "Fyll i ett värde.";
    return;
  }
  isSubmitting.value = true;
  try {
    const success = action === "delete"
      ? await deleteAccount()
      : await updateProfile({ [action]: value });
    if (success && profileDialog.value?.open) closeDialog();
  } finally {
    isSubmitting.value = false;
  }
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
      errorMessage.value = "Kunde inte hämta användarinformationen.";
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
      body: JSON.stringify(updateData),
    });

    if (response.ok) {
      await myProfile();
      return true;
    } else {
      const err = await response.json().catch(() => null);
      dialogError.value = err?.error || "Kunde inte uppdatera profilen. Försök igen.";
    }
  } catch (error) {
    dialogError.value = "Ett fel uppstod. Försök igen.";
  }
  return false;
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
      router.push("/");
      return true;
    } else {
      const err = await response.json().catch(() => null);
      dialogError.value = err?.error || "Kunde inte ta bort kontot. Försök igen.";
    }
  } catch (error) {
    dialogError.value = "Ett fel uppstod. Försök igen.";
  }
  return false;
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
          aria-label="Ändra profilbild"
          @click="openDialog('picture', $event)"
        >
          📷
        </button>
      </div>
    </div>

    <div class="my-profile-username">
      <h3>{{ user?.username || props.username }}</h3>
    </div>

    <p v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </p>

    <div class="options-list">
      <button
        v-for="action in ['username', 'password', 'delete']"
        :key="action"
        type="button"
        class="button option-card"
        @click="openDialog(action, $event)"
      >
        <span class="icon" aria-hidden="true">{{ { username: '👤', password: '🔒', delete: '🗑️' }[action] }}</span>
        <span>{{ actionLabels[action] }}</span>
        <span class="arrow" aria-hidden="true">›</span>
      </button>
    </div>

    <dialog
      ref="profileDialog"
      class="profile-dialog"
      aria-labelledby="profile-dialog-title"
      :aria-describedby="activeAction === 'delete' ? 'profile-delete-warning' : undefined"
      @keydown.esc.stop
      @close="handleDialogClose"
    >
      <form @submit.prevent="submitDialog" :aria-busy="isSubmitting">
        <h2 id="profile-dialog-title">{{ dialogTitle }}</h2>
        <p v-if="activeAction === 'delete'" id="profile-delete-warning">
          Är du säker på att du vill ta bort ditt konto? Det går inte att ångra.
        </p>
        <div v-else class="profile-field">
          <label for="profile-dialog-input">{{ inputLabel }}</label>
          <input
            id="profile-dialog-input"
            v-model="formValue"
            :type="inputType"
            :autocomplete="activeAction === 'password' ? 'new-password' : undefined"
            :aria-invalid="dialogError ? 'true' : undefined"
            :aria-describedby="dialogError ? 'profile-dialog-error' : undefined"
            :disabled="isSubmitting"
            required
          />
        </div>
        <p v-if="dialogError" id="profile-dialog-error" class="dialog-error" role="alert">
          {{ dialogError }}
        </p>
        <div class="dialog-buttons">
          <button type="button" class="button" @click="closeDialog">Avbryt</button>
          <button type="submit" class="button" :disabled="isSubmitting">
            {{ isSubmitting ? 'Vänta…' : activeAction === 'delete' ? 'Bekräfta borttagning' : 'Spara' }}
          </button>
        </div>
      </form>
    </dialog>
  </div>
</template>

<style scoped>
.profile-dialog {
  box-sizing: border-box;
  width: calc(100% - 32px);
  max-width: 400px;
  max-height: calc(100dvh - 32px);
  overflow-y: auto;
  margin: auto;
  padding: 24px;
  border: 1px solid var(--accent-gold);
  border-radius: 8px;
  background-color: var(--bg-dark);
  color: var(--accent-gold);
}

.profile-dialog::backdrop {
  background-color: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(2px);
}

.profile-dialog h2 {
  margin: 0 0 20px;
  font-size: 1.4rem;
  overflow-wrap: anywhere;
}

.profile-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.profile-field input {
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  padding: 10px;
  border: 1px solid var(--accent-gold);
  border-radius: 4px;
  background-color: var(--bg-dark);
  color: var(--accent-gold);
  font: inherit;
}

.dialog-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 20px;
}

.dialog-buttons .button {
  flex: 1 1 120px;
  white-space: normal;
  height: auto;
  min-height: 40px;
}

button:focus-visible,
.profile-field input:focus-visible {
  outline: 2px solid var(--accent-gold);
  outline-offset: 3px;
}

button:disabled {
  opacity: 0.6;
  cursor: wait;
}

.dialog-error {
  color: #ffb4b4;
  overflow-wrap: anywhere;
}

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
</style>
