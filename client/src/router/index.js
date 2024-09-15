import { createRouter, createWebHistory } from "vue-router";

import Clients from "@/views/Clients.vue";
import Home from "@/views/Home.vue";
import Loja from "@/views/Loja.vue";
import NotFound from "@/views/NotFound.vue";
import Register from "@/views/Register.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },

  {
    path: "/register",
    name: "Register",
    component: Register,
  },

  {
    path: "/academy_clients",
    name: "Clients",
    component: Clients,
  },

  {
    path: "/:catchAll(.*)",
    name: "NotFound",
    component: NotFound,
  },

  {
    path: "/loja",
    name: "Loja",
    component: Loja,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
