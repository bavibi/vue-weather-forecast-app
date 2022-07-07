<script setup lang="ts">
  import { RouterLink, RouterView, useRoute, useRouter, type RouterLinkProps } from "vue-router";
  import { ref, watch, type Ref, nextTick } from "vue";

  const route = useRoute();
  const nav = ref(null as HTMLElement | null);
  const cursor = ref(null as HTMLDivElement | null);
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
  watch(() => route.matched, () => {
    if (nav.value != null && cursor.value != null) {
      const a = nav.value.querySelector(":scope > .active") as HTMLAnchorElement;
      if (a == null) return;
      const cur = cursor.value;
      cur.style.setProperty("--start-width", `${cur.clientWidth}px`);
      cur.style.setProperty("--start-left", `${cur.offsetLeft}px`);
      cur.style.setProperty("--end-left", `${a.offsetLeft}px`);
      cur.style.setProperty("--end-width", `${a.clientWidth}px`);
      cur.classList.add("initialized");
      if (changedRouteOnce) {
        cur.classList.add("anim");
        cur.addEventListener(
          "animationend",
          () => cursor.value?.classList.remove("anim"),
          { once: true }
        );
      }
      else {
        changedRouteOnce = true;
      }
    }
  }, {
    flush: "post",
  });


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
  },
  {
    flush: "pre"
  });

</script>

<template>
  <header>
      <nav ref="nav">
        <div class="cursor" ref="cursor"></div>
        <RouterLink v-for="route in routes" :to="route.to" active-class="active">{{route.text}}</RouterLink>
      </nav>
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

  nav {
    display: flex;
    flex-direction: row;
    gap: 20px;
    padding: 5px 15px;
    font-size: 20px;
    border: black solid 2px;
    border-radius: 15px;
    margin: 5px;
    height: 3em;
    align-items: center;
  }

  nav > a {
    text-decoration: none;
    font-weight: bold;
    color: black;
    transition: all 0.5s ease-out;
  }

  nav > a:not(.active) {
    color: var(--grayed-out);
    /* transform: translate(0, +0.25em); */
  }
  
  .cursor {
    position: absolute;
    --end-width: 0;
    --x-padding: 20px;
    --calc-width: calc(var(--end-width) + var(--x-padding));
    /* by default copy value */
    --start-width: var(--calc-width);
    width: var(--calc-width);
    /* by default copy value */
    --start-left: var(--calc-left);
    --calc-left:  calc(var(--end-left) - var(--x-padding) / 2);
    left: var(--calc-left);
    height: 75%;
    background-color: var(--second-color);
    border-radius: 12px;
    border: black solid 1px;
  }

  .cursor:not(.initialized) {
    display: none;
  }

  .cursor.anim {
    animation: change-width 1s ease-out 0s 1;
  }

  @keyframes change-width {
    0% {
      width: var(--start-width);
      left: var(--start-left);
    }

    50% {
      width: 50px;
      left: calc(var(--calc-left) + var(--calc-width) * 0.5 - 25px);
    }

    100% {
      width: var(--calc-width);
      left: var(--calc-left);
    }
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
