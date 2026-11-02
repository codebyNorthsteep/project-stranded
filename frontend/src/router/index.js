import { createRouter, createWebHistory } from "vue-router";
import Welcome from "../views/Welcome.vue";
import Login from "../views/Auth/Login.vue";
import Register from "../views/Auth/Register.vue";
import MyDashboard from "../views/MyDashboard.vue";
import Quiz from "../views/QuizView.vue";
import NotFound from "../views/NotFound.vue";

const routes = [
  {
    path: "/",
    name: "Welcome",
    component: Welcome,
    meta: { requiresAuth: false },
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: { requiresAuth: false },
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
    meta: { requiresAuth: false },
  },
  {
    path: "/dashboard",
    name: "MyDashboard",
    component: MyDashboard,
    meta: { requiresAuth: true },
  },
  {
    path: "/quiz/:levelId/questions",
    name: "Quiz",
    component: Quiz,
    beforeEnter: (to, from) => {
      const levelId = Number(to.params.levelId);

      if (!Number.isSafeInteger(levelId) || levelId <= 0) {
        return from.fullPath && from.fullPath !== to.fullPath
          ? from.fullPath
          : { name: "MyDashboard" };
      }
    },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "notfound",
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to, from) => {
  const isAuthenticated = Boolean(localStorage.getItem("user_token"));

  if (to.meta.requiresAuth && !isAuthenticated) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    return {
      path: "/login",
    };
  }

  // If the user has already logged in
  // they can not go back to login/welcome/register pages without pressing the log out button
  if (
    isAuthenticated &&
    (to.name === "Login" || to.name === "Register" || to.name === "Welcome")
  ) {
    return {
      path: "/dashboard",
    };
  }
});

export default router;
