<template>
  <div class="app-layout">
    <!-- Sidebar -->
    <Sidebar />

    <!-- Main content area -->
    <div class="main-content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.app-layout {
  display: flex;
  min-height: 100vh;
  background-color: #f8fafc;
}

.main-content {
  flex: 1;
  margin-left: 80px;
  padding: 0;
  background-color: #f8fafc;
  min-height: 100vh;
}

/* Responsive design */
@media (max-width: 1024px) {
  .main-content {
    margin-left: 70px;
  }
}

@media (max-width: 768px) {
  .app-layout {
    flex-direction: column;
  }

  .main-content {
    margin-left: 0;
  }
}
</style>
