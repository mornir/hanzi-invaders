<template>
  <div class="bg-white p-4 rounded-full mb-4">
    <p class="text-3xl font-semibold text-center">{{ sentence }}</p>
  </div>
</template>

<script>
export default {
  props: {
    sentence: {
      type: String,
      required: true,
      default: 'Missing Sentence',
    },
  },
}
</script>

<style>
</style>
