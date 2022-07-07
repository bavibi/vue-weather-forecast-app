<script setup lang="ts">
import { RouterLink, RouterView, useRoute, useRouter, type RouterLinkProps } from "vue-router";
import { ref, watch, type Ref, nextTick } from "vue";
import Nav from "@/components/Nav.vue";

const route = useRoute();
const routeAnimName: Ref<"slide-left" | "slide-right" | "none"> = ref("none");

function getRouteIdxByPath(path: string): number {
  const routeDesc = routes.filter(r => r.to == route.path)[0];
  return routes.indexOf(routeDesc);
}


const routes = [
  { to: "/", text: "Главная страница", },
  { to: "/weatherforecasts", text: "Все прогнозы погоды", },
  { to: "/weatherforecast", text: "Прогноз погоды по id", },
];



let changedRouteOnce = false;
let lastRouteIndex = getRouteIdxByPath(route.path);
watch(() => route.matched, () => {
  if (changedRouteOnce) {
    const nextRouteIndex = getRouteIdxByPath(route.path);
    if (nextRouteIndex > lastRouteIndex) {
      routeAnimName.value = "slide-left";
    }
    else {
      routeAnimName.value = "slide-right";
    }

    lastRouteIndex = nextRouteIndex;
  }
  else {
    changedRouteOnce = true;
  }
},
  {
    flush: "pre"
  });

</script>

<template>
  <header>
    <Nav :routes="routes"></Nav>
  </header>
  <RouterView v-slot="{ Component }">
    <Transition :name="routeAnimName">
      <component :is="Component" />
    </Transition>
  </RouterView>
</template>

<style>
@import "@/assets/base.css";

#app {
  display: flex;
  flex-direction: column;
}

header {
  /* to disable margin collapsing */
  overflow: hidden;
}


.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  position: absolute;
  transition: left 1s;
  width: 100%;
  top: 100%;
}

.slide-left-enter-from {
  left: 100%;
}

.slide-left-enter-to {
  left: 0%;
}

.slide-left-leave-from {
  left: 0%;
}

.slide-left-leave-to {
  left: -100%;
}

.slide-right-enter-from {
  left: -100%;
}

.slide-right-enter-to {
  left: 0%;
}

.slide-right-leave-from {
  left: 0%;
}

.slide-right-leave-to {
  left: 100%;
}
</style>
