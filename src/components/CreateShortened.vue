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
          @keydown.enter="shorten"
        />
      </div>
      <LargeButton @click="shorten" :disabled="!longUrlValid || !longUrlField.length">
        shorten
      </LargeButton>
      <span v-if="errorText" class="text-red-600 text-sm">{{ errorText }}</span>
    </form>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue"
import ky from "ky"
import { disallowedSlugs, isURI, slugReg } from "../../util"
import UriInput from "./UriInput.vue"
import LargeButton from "./LargeButton.vue"

export default defineComponent({
  components: { UriInput, LargeButton },
  emits: ["shortened"],
  setup(_, { emit }) {
    const APIURL =
      process.env.NODE_ENV === "development" ? "http://localhost:8000" : window.location.origin
    const showCustomUrlField = ref(false)
    const longUrlField = ref("")
    const shortUrlField = ref("")
    const errorText = ref("")

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
      errorText.value = ""

      if (longUrlField.value.length && longUrlValid) {
        const json: Record<string, string> = { target: longUrlField.value }

        if (shortUrlField.value) {
          if (shortUrlField.value.match(slugReg)) {
            errorText.value = "please only use letters, numbers, - and _ as postfix."
            return
          }
          if (disallowedSlugs.includes(shortUrlField.value)) {
            errorText.value = `postfix ${shortUrlField.value} not allowed.`
            return
          }
          json.slug = shortUrlField.value
        }

        const shortened = await ky.post(`${APIURL}/@/create`, { json, throwHttpErrors: false })
        console.log("shortened", shortened)

        if (shortened.status === 409) {
          errorText.value = await shortened.text()
          return
        }

        emit("shortened", await shortened.json())
      }
    }

    return {
      showCustomUrlField,
      longUrlField,
      longUrlValid,
      shortUrlField,
      enableCustomUrl,
      errorText,
      shorten,
      paste,
    }
  },
})
</script>