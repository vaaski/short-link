<template>
  <div class="create-shortened w-10/12">
    <form class="flex flex-col items-center">
      <div class="text-fields py-5 w-full max-w-2xl">
        <div class="long-url flex">
          <uri-input
            v-model="longUrlField"
            placeholder="long url"
            :class="{
              'text-red-600 dark:text-red-600 ring-red-600':
                !longUrlValid && longUrlField.length,
            }"
            @keydown.enter="shorten"
          />
          <button
            @click="paste"
            class="bg-main-accent text-white px-4 ml-2 rounded h-auto focus:outline-none focus:bg-off-accent transition-colors ring-1 ring-main-accent focus:ring-off-accent"
          >
            paste
          </button>
        </div>
        <button
          v-if="!showCustomUrlField"
          @click="enableCustomUrl"
          class="text-xs text-gray-400 mx-2 my-0.5 focus:outline-none"
        >
          custom short url
        </button>
        <uri-input
          v-model="shortUrlField"
          v-if="showCustomUrlField"
          placeholder="custom short url postfix"
        />
      </div>
      <LargeButton @click="shorten" :disabled="!longUrlValid || !longUrlField.length"
        >shorten</LargeButton
      >
    </form>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue"
import ky from "ky"
import { isURI } from "../../util"
import UriInput from "./UriInput.vue"
import LargeButton from "./LargeButton.vue"

console.log(process.env.NODE_ENV)

export default defineComponent({
  components: { UriInput, LargeButton },
  emits: ["shortened"],
  setup(_, { emit }) {
    const APIURL = window.backendURL
    const showCustomUrlField = ref(false)
    const longUrlField = ref("")
    const shortUrlField = ref("")
    const enableCustomUrl = (e: MouseEvent) => {
      e.preventDefault()
      showCustomUrlField.value = true
    }
    const paste = async (e: MouseEvent) => {
      e.preventDefault()
      longUrlField.value = await navigator.clipboard.readText()
    }

    const longUrlValid = computed(() => isURI(longUrlField.value))
    const shorten = async (e: MouseEvent) => {
      e.preventDefault()

      if (longUrlField.value.length && longUrlValid) {
        // TODO validate slug for spaces
        const json: Record<string, string> = { target: longUrlField.value }

        if (shortUrlField.value) json.slug = shortUrlField.value

        // TODO show error visually
        const shortened = await ky.post(`${APIURL}/@/create`, { json }).json()
        emit("shortened", shortened)
      }
    }

    console.log(window.backendURL)

    return {
      showCustomUrlField,
      longUrlField,
      longUrlValid,
      shortUrlField,
      enableCustomUrl,
      shorten,
      paste,
    }
  },
})
</script>