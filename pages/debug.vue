<template>
  <div style="padding: 20px; font-family: monospace">
    <h1>Runtime Config Debug</h1>
    <h2>Full Config:</h2>
    <pre>{{ JSON.stringify(config, null, 2) }}</pre>

    <h2>Facebook Values:</h2>
    <p>Facebook App ID: {{ config.public?.facebookAppId || 'NOT SET' }}</p>
    <p>
      Facebook Config ID: {{ config.public?.facebookConfigId || 'NOT SET' }}
    </p>

    <h2>Other Values:</h2>
    <p>Operation URL: {{ config.public?.operationUrl || 'NOT SET' }}</p>
    <p>Google Client ID: {{ config.public?.googleClientId || 'NOT SET' }}</p>
  </div>
</template>

<script setup>
const config = useRuntimeConfig()
</script>
