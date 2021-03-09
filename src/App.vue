<template>
  <main class="flex">
    <img src="/logo.svg" alt="shr.li logo" class="logo" />
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
  max-width: 500px;
}
</style>
