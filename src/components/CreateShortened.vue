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
          />
          <button
            @click="paste"
            class="paste bg-blue-700 text-white px-4 mx-2 rounded h-auto focus:outline-none focus:bg-blue-800 transition-colors ring-1 ring-blue-700 focus:ring-blue-800"
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
        <uri-input v-model="shortUrlField" v-if="showCustomUrlField" placeholder="custom short url" />
      </div>
      <button
        class="block w-1/3 mx-auto py-3 my-3 bg-blue-700 text-white focus:bg-blue-800 shadow-md rounded transition-all focus:outline-none focus:shadow-2xl"
        @click="shorten"
      >
        shorten
      </button>
    </form>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue"
import ky from "ky"
import { isURI } from "../../util"
import UriInput from "./UriInput.vue"

export default defineComponent({
  components: { UriInput },
  setup() {
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
        const json: Record<string, string> = { target: longUrlField.value }

        if (shortUrlField.value) json.slug = shortUrlField.value

        console.log(await ky.post(`${APIURL}/@/create`, { json }).json())
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