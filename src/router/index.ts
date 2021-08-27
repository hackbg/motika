import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import Home from "../views/Home.vue";
import GenerateTx from "../views/GenerateTx.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/generate",
    name: "Generate Tx",
    component: GenerateTx,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
