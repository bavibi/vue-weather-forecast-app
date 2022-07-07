import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/weatherforecasts",
      name: "weatherforecasts",
      component: () => import("../views/WeatherForecastsView.vue"),
    },
    {
      path: "/weatherforecast/:id",
      name: "weatherforecastByIdWithParam",
      component: () => import("../views/WeatherForecastView.vue"),
    },
    {
      path: "/weatherforecast",
      name: "weatherforecastById",
      component: () => import("../views/WeatherForecastView.vue"),
    },
  ],
});

export default router;
