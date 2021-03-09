<template>
  <input
    type="text"
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
    class="text-center shadow py-2 px-5 w-full focus:outline-none focus:shadow-md transition rounded ring-1 ring-gray-400 last:mt-4 dark:bg-dark-blue dark:text-white focus:ring-2"
  />
</template>

<script lang="ts">
import { defineComponent } from "vue"
export default defineComponent({
  name: "UriInput",
  props: {
    modelValue: String,
  },
  emits: ["update:modelValue"],
})
</script>