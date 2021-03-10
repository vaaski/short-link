<template>
  <main class="h-full flex justify-center items-center flex-col dark:bg-dark-blue">
    <img
      src="./assets/logo.svg"
      alt="shr.li logo"
      class="logo"
      width="500"
      height="175.78125"
    />
    <CreateShortened v-if="view === 'shorten'" @shortened="onShortened" />
    <ViewShortened
      v-else-if="view === 'shortened'"
      @shorten="view = 'shorten'"
      :shortened="shortened"
    />
  </main>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue"
import { ShortenedURISlim } from "../types/api"
import CreateShortened from "./components/CreateShortened.vue"
import ViewShortened from "./components/ViewShortened.vue"

export default defineComponent({
  name: "App",
  components: {
    CreateShortened,
    ViewShortened,
  },
  setup() {
    const view = ref("shorten")
    const shortened = ref<ShortenedURISlim>({
      slug: "1yJF",
      target: "http://localhost:8080/?",
    })

    const onShortened = (short: ShortenedURISlim) => {
      view.value = "shortened"
      shortened.value = short
    }

    return {
      view,
      shortened,
      onShortened,
    }
  },
})
</script>

<style>
main > .logo {
  width: 500px;
  max-width: 90vw;
}
</style>
