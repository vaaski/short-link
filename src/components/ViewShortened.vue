<template>
  <div class="view-shortened dark:text-white flex items-center justify-center flex-col w-full">
    <h2 class="opacity-80 text-md">your short link:</h2>
    <a class="text-xl my-2" :href="shortURL">{{ shortURL.replace(/https?:\/\//, "") }}</a>
    <span class="text-xs opacity-30">(redirects to {{ shortTarget }})</span>
    <div class="flex gap-2 w-full max-w-xs">
      <LargeButton @click="copy">copy</LargeButton>
      <LargeButton @click="$emit('shorten')">shorten more</LargeButton>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref } from "vue"
import type { ShortenedURISlim } from "../../types/api"
import LargeButton from "./LargeButton.vue"

export default defineComponent({
  name: "ViewShortened",
  components: { LargeButton },
  props: {
    shortened: { required: true, type: Object as PropType<ShortenedURISlim> },
  },
  emits: ["shorten"],
  setup(props) {
    const APIURL =
      process.env.NODE_ENV === "development" ? "http://localhost:8000" : window.location.origin
    const slug = ref(props.shortened.slug)
    const target = ref(props.shortened.target)

    const shortURL = computed(() => `${APIURL}/${slug.value}`)
    const shortTarget = computed(() => new URL(target.value).host)

    const copy = () => {
      navigator.clipboard.writeText(shortURL.value)
    }

    return {
      shortURL,
      slug,
      target,
      shortTarget,
      copy,
    }
  },
})
</script>