import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import Home from "../views/Home.vue";
import GenerateTx from "../views/GenerateTx.vue";
import SignTx from "../views/SignTx.vue";

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
  {
    path: "/sign",
    name: "Sign Tx",
    component: SignTx,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
