<template>
  <NuxtLayout name="default">
    <div class="error-page">
      <div class="error-container">
        <!-- Error Image -->
        <div class="error-image">
          <img src="/error.avif" alt="Error illustration" />
        </div>

        <!-- Error Content -->
        <div class="error-content">
          <h1 class="error-title">{{ error.statusCode }}, Page not found</h1>
          <p class="error-description">
            Something went wrong. It's look that your requested could not be
            found. It's look like the link is broken or the page is removed.
          </p>

          <!-- Go Back Button -->
          <button @click="handleError" class="go-back-btn">
            Go Back Home
            <span class="arrow-icon">→</span>
          </button>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup>
// Define props for error handling
const props = defineProps({
  error: Object
})

// Handle error - navigate back to home
const handleError = async () => {
  await navigateTo('/')
}
</script>

<style scoped>
.error-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.error-container {
  max-width: 800px;
  width: 100%;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3rem;
}

.error-image {
  width: 100%;
  max-width: 500px;
  margin-bottom: 1rem;
}

.error-image img {
  width: 100%;
  height: auto;
  max-width: 500px;
}

.error-content {
  max-width: 600px;
}

.error-title {
  font-size: 4.8rem;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 2rem;
  line-height: 1.2;
}

.error-description {
  font-size: 1.8rem;
  color: var(--color-grayscale-70);
  line-height: 1.6;
  margin-bottom: 3rem;
  font-weight: 400;
}

.go-back-btn {
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 1.6rem 3.2rem;
  font-size: 1.8rem;
  font-weight: 600;
  font-family: 'SVN-Circular', sans-serif;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(236, 88, 37, 0.2);
}

.go-back-btn:hover {
  background-color: var(--color-primary-light);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(236, 88, 37, 0.3);
}

.go-back-btn:active {
  transform: translateY(0);
}

.arrow-icon {
  font-size: 2rem;
  font-weight: bold;
  transition: transform 0.3s ease;
}

.go-back-btn:hover .arrow-icon {
  transform: translateX(4px);
}

/* Responsive Design */
@media (max-width: 768px) {
  .error-page {
    padding: 1rem;
  }

  .error-container {
    gap: 2rem;
  }

  .error-title {
    font-size: 3.6rem;
  }

  .error-description {
    font-size: 1.6rem;
    margin-bottom: 2rem;
  }

  .go-back-btn {
    padding: 1.4rem 2.4rem;
    font-size: 1.6rem;
  }

  .error-image {
    max-width: 400px;
  }
}

@media (max-width: 480px) {
  .error-title {
    font-size: 2.8rem;
  }

  .error-description {
    font-size: 1.4rem;
  }

  .error-image {
    max-width: 320px;
  }
}
</style>
