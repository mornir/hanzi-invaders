<template>
  <div class="p-4 rounded-full mb-4"
       :class="[ sentence.mark ? 'bg-green' : 'bg-white']">
    <p class="text-3xl font-semibold text-center">{{ sentence.sentence }}</p>
  </div>
</template>

<script>
export default {
  props: {
    sentence: {
      type: Object,
      required: true,
    },
  },
}
</script>

<style>
</style>
