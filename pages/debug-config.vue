<template>
  <div>
    <h1>Debug Runtime Config</h1>
    <pre>{{ JSON.stringify(config, null, 2) }}</pre>
  </div>
</template>

<script setup>
const config = useRuntimeConfig()
</script>
