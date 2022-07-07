<script setup lang="ts">

import { RouterLink, RouterView, useRoute, useRouter, type RouterLinkProps } from "vue-router";
import { watch, ref } from "vue";

defineProps<{
    routes: Array<{
        to: string,
        text: string,
    }>
}>();

const route = useRoute();
const cursor = ref(null as HTMLDivElement | null);
const nav = ref(null as HTMLElement | null);

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

        // prevent animation from playing when page initally loads
        if (changedRouteOnce) {
            cur.classList.remove("anim");
            // trigger reflow
            cur.offsetHeight;
            cur.classList.add("anim");
        }
        else {
            changedRouteOnce = true;
        }
    }
}, {
    flush: "post",
});

</script>

<template>
    <nav ref="nav">
        <div class="cursor" ref="cursor"></div>
        <RouterLink v-for="route in routes" :to="route.to" active-class="active">{{ route.text }}</RouterLink>
    </nav>
</template>

<style>
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

nav>a {
    text-decoration: none;
    font-weight: bold;
    color: black;
    transition: all 0.5s ease-out;
}

nav>a:not(.active) {
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
    --calc-left: calc(var(--end-left) - var(--x-padding) / 2);
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
    animation-name: change-width;
    animation-duration: 1s;
    animation-timing-function: ease-out;
    animation-iteration-count: 1;
    animation-fill-mode: forwards;
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
</style>