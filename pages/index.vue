<template>
  <div class="container">
    <h1>Welcome to Napricot Social</h1>
    <p>Connect with your social accounts to get started!</p>
    <div class="login-options">
      <ClientOnly>
        <FacebookLogin />
      </ClientOnly>
      <ClientOnly>
        <YouTubeLogin />
      </ClientOnly>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="postcss">
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 2rem;
  text-align: center;
}

.container h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #333;
}

.container p {
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 2rem;
}

.login-options {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
}

@media (min-width: 768px) {
  .login-options {
    flex-direction: row;
    gap: 2rem;
  }
}
</style>
