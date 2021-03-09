<template>
  <main class="h-full flex justify-center items-center flex-col dark:bg-dark-blue">
    <img src="./assets/logo.svg" alt="shr.li logo" class="logo" width="500px" height="175.78125px" />
    <CreateShortened />
  </main>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import CreateShortened from "./components/CreateShortened.vue"

export default defineComponent({
  name: "App",
  components: {
    CreateShortened,
  },
})
</script>

<style>
main > .logo {
  width: 500px;
  max-width: 90vw;
}
</style>
