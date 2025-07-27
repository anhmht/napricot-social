<template>
  <ClientOnly>
    <Connection />
  </ClientOnly>
</template>

<script setup lang="ts">
import Connection from '~/components/Page/Connection/Connection.vue'
definePageMeta({
  middleware: 'auth'
})
</script>

<style lang="postcss" scoped></style>
