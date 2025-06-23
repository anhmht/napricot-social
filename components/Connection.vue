<template>
  <div class="connections-container">
    <div class="connections-header">
      <h1>Connections</h1>
    </div>

    <div class="connections-list">
      <!-- Facebook Connection -->
      <ConnectionItem
        icon-src="/icons/facebook.svg"
        icon-alt="Facebook"
        icon-class="facebook"
        title="Facebook Connect"
      >
        <FacebookLogin />
      </ConnectionItem>

      <!-- YouTube Connection -->
      <ConnectionItem
        icon-src="/icons/youtube.svg"
        icon-alt="YouTube"
        icon-class="youtube"
        title="YouTube Connect"
      >
        <YouTubeLogin />
      </ConnectionItem>

      <!-- Threads Connection -->
      <ConnectionItem
        icon-src="/icons/threads.svg"
        icon-alt="Threads"
        icon-class="threads"
        title="Threads Connect"
      >
        <ThreadLogin />
      </ConnectionItem>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="postcss">
.connections-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #f8f9fa;
  min-height: 100vh;
}

.connections-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.connections-header h1 {
  font-weight: 600;
  color: #333;
  margin: 0;
}

.connections-list {
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

@media (max-width: 768px) {
  .connections-container {
    padding: 1rem;
  }

  .connections-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .search-input {
    width: 100%;
  }
}
</style>
