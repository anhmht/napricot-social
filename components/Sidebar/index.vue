<template>
  <!-- Mobile Toggle Button -->
  <button
    @click="toggleMobile"
    class="mobile-toggle"
    :class="{ active: mobileOpen }"
  >
    <span></span>
    <span></span>
    <span></span>
  </button>

  <!-- Mobile Overlay -->
  <div v-if="mobileOpen" @click="closeMobile" class="mobile-overlay"></div>

  <div class="sidebar" :class="{ 'mobile-open': mobileOpen }">
    <!-- Logo section -->
    <div class="logo-section">
      <img src="/Logo.png" alt="Logo" class="logo" />
      <span class="logo-text">Automation</span>
    </div>

    <!-- Navigation -->
    <nav class="navigation">
      <div class="nav-section">
        <SidebarItem v-if="user" to="/" icon="connections" text="Connections" />

        <!-- Guides Parent Nav -->
        <SidebarGroup icon="guides" text="Guides">
          <SidebarSubItem to="/guides/getting-started" text="Getting Started" />
          <SidebarSubItem to="/guides/advanced" text="Advanced Guide" />
        </SidebarGroup>
      </div>
    </nav>

    <!-- User Navigation at Bottom -->
    <div class="user-nav" v-if="user">
      <div class="nav-section">
        <SidebarGroup icon="user" text="User">
          <SidebarSubItem @click="signOut" text="Sign Out" />
        </SidebarGroup>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { user } = useAuth()

const mobileOpen = ref(false)

const toggleMobile = () => {
  mobileOpen.value = !mobileOpen.value
}

const closeMobile = () => {
  mobileOpen.value = false
}

const signOut = async () => {
  // Handle sign out logic here
  const { signOut } = useAuth()
  await signOut()
  await navigateTo('/login')
}
</script>

<style scoped>
.sidebar {
  width: 80px;
  background: linear-gradient(
    180deg,
    var(--color-primary-light) 0%,
    var(--color-primary) 50%,
    #d04b20 100%
  );
  position: fixed;
  height: 100vh;
  left: 0;
  top: 0;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  transition: width 0.3s ease;
  overflow: hidden;
  z-index: 1000;
}

.sidebar:hover {
  width: 280px;
}

.logo-section {
  padding: 2rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  min-height: 96px;
  white-space: nowrap;
}

.logo {
  height: 48px;
  width: auto;
  filter: brightness(0) invert(1);
  transition: height 0.3s ease;
  flex-shrink: 0;
}

.sidebar:hover .logo {
  height: 48px;
}

.logo-text {
  color: white;
  font-size: 2.5rem;
  font-weight: 600;
  opacity: 0;
  transform: translateX(-10px);
  transition: all 0.3s ease;
  margin-top: 12px;
}

.sidebar:hover .logo-text {
  opacity: 1;
  transform: translateX(0);
}

.navigation {
  flex: 1;
  padding: 2rem 0;
}

.user-nav {
  margin-top: auto;
  padding: 1rem 0 2rem 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.nav-section {
  padding: 0 1rem;
}

/* Mobile Toggle Button */
.mobile-toggle {
  display: none;
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 1001;
  background: var(--color-primary);
  border: none;
  border-radius: 0.5rem;
  width: 48px;
  height: 48px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.mobile-toggle span {
  width: 22px;
  height: 2px;
  background: white;
  border-radius: 1px;
  transition: all 0.3s ease;
  transform-origin: center;
}

.mobile-toggle.active span:nth-child(1) {
  transform: rotate(45deg);
  position: absolute;
}

.mobile-toggle.active span:nth-child(2) {
  opacity: 0;
  transform: scale(0);
}

.mobile-toggle.active span:nth-child(3) {
  transform: rotate(-45deg);
  position: absolute;
}

.mobile-overlay {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
}

@media (max-width: 768px) {
  .mobile-toggle {
    display: flex;
  }

  .mobile-overlay {
    display: block;
  }

  .sidebar {
    width: 280px;
    position: fixed;
    height: 100vh;
    left: -280px;
    top: 0;
    transition: left 0.3s ease;
    z-index: 1000;
  }

  .sidebar.mobile-open {
    left: 0;
  }

  .sidebar:hover {
    width: 280px;
  }

  .logo-section {
    padding: 1.5rem;
    min-height: auto;
  }

  .logo-text {
    opacity: 1;
    transform: translateX(0);
  }

  .navigation {
    padding: 1rem 0 2rem 0;
  }
}
</style>
