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
      <span class="logo-text">Napricot Social</span>
    </div>

    <!-- Navigation -->
    <nav class="navigation">
      <div class="nav-section">
        <NuxtLink to="/" class="nav-item active">
          <div class="nav-icon">
            <img
              src="/icons/connections.svg"
              alt="Connections"
              class="nav-icon-img"
            />
          </div>
          <span class="nav-text">Connections</span>
        </NuxtLink>

        <!-- Guides Parent Nav -->
        <div class="nav-group">
          <div
            @click="toggleGuides"
            class="nav-item nav-parent"
            :class="{ expanded: guidesExpanded }"
          >
            <div class="nav-icon">
              <img src="/icons/guides.svg" alt="Guides" class="nav-icon-img" />
            </div>
            <span class="nav-text">Guides</span>
            <div class="nav-arrow">
              <img src="/icons/arrow.svg" alt="Arrow" class="arrow-img" />
            </div>
          </div>

          <!-- Sub Navigation -->
          <div class="sub-nav" :class="{ expanded: guidesExpanded }">
            <NuxtLink to="/guides/getting-started" class="nav-item nav-sub">
              <span class="nav-text">Getting Started</span>
            </NuxtLink>
            <NuxtLink to="/guides/advanced" class="nav-item nav-sub">
              <span class="nav-text">Advanced Guide</span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </nav>

    <!-- User Navigation at Bottom -->
    <div class="user-nav">
      <div class="nav-section">
        <div class="nav-group">
          <div
            @click="toggleUser"
            class="nav-item nav-parent"
            :class="{ expanded: userExpanded }"
          >
            <div class="nav-icon">
              <img src="/icons/user.svg" alt="User" class="nav-icon-img" />
            </div>
            <span class="nav-text">User</span>
            <div class="nav-arrow">
              <img src="/icons/arrow.svg" alt="Arrow" class="arrow-img" />
            </div>
          </div>

          <!-- Sub Navigation -->
          <div class="sub-nav" :class="{ expanded: userExpanded }">
            <div @click="signOut" class="nav-item nav-sub">
              <span class="nav-text">Sign Out</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const guidesExpanded = ref(false)
const userExpanded = ref(false)
const mobileOpen = ref(false)

const toggleGuides = () => {
  guidesExpanded.value = !guidesExpanded.value
}

const toggleUser = () => {
  userExpanded.value = !userExpanded.value
}

const toggleMobile = () => {
  mobileOpen.value = !mobileOpen.value
}

const closeMobile = () => {
  mobileOpen.value = false
}

const signOut = () => {
  // Handle sign out logic here
  console.log('Sign out clicked')
  // You can add actual sign out logic here
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

.nav-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  border-radius: 0.75rem;
  margin-bottom: 0.5rem;
  transition: all 0.2s ease;
  font-weight: 500;
  white-space: nowrap;
  position: relative;
}

.sidebar:hover .nav-item {
  padding: 1rem;
}

.nav-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
}

.nav-item.active {
  background-color: rgba(255, 255, 255, 0.15);
  color: white;
  font-weight: 600;
}

.nav-icon {
  display: flex;
  align-items: center;
  padding: 0 1rem;
  flex-shrink: 0;
}

.nav-icon-img {
  width: 20px;
  height: 20px;
  filter: brightness(0) invert(1);
}

.nav-text {
  font-size: 1.6rem;
  opacity: 0;
  transform: translateX(-10px);
  transition: all 0.3s ease;
  text-decoration: none;
}

.sidebar:hover .nav-text {
  opacity: 1;
  transform: translateX(0);
}

.nav-group {
  width: 100%;
}

.nav-parent {
  position: relative;
}

.nav-arrow {
  opacity: 0;
  transform: translateX(-10px);
  transition: all 0.3s ease;
  color: rgba(255, 255, 255, 0.8);
  margin-left: auto;
}

.arrow-img {
  width: 12px;
  height: 12px;
  filter: brightness(0) invert(1);
}

.sidebar:hover .nav-arrow {
  opacity: 1;
  transform: translateX(0) rotate(0deg);
}

.nav-parent.expanded .nav-arrow {
  transform: translateX(0) rotate(90deg);
}

.sub-nav {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
  margin-left: 1rem;
}

.sub-nav.expanded {
  max-height: 200px;
}

.nav-sub {
  padding-left: 3rem !important;
  font-size: 1.4rem !important;
  /* background-color: rgba(255, 255, 255, 0.05); */
  margin: 0.25rem 0.5rem;
  border-radius: 0.5rem;
}

.nav-sub .nav-text {
  font-size: 1.4rem;
}

.sidebar:hover .nav-sub {
  padding-left: 3rem !important;
}

/* Responsive design */
@media (max-width: 1024px) {
  .sidebar {
    width: 70px;
  }

  .sidebar:hover {
    width: 240px;
  }
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

  .nav-text {
    opacity: 1;
    transform: translateX(0);
  }

  .nav-item {
    padding: 1rem 1.5rem;
  }

  .nav-arrow {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
