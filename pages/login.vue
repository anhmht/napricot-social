<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <h2>Welcome To Napricot Automation</h2>
        <p>Sign in to your account</p>
      </div>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="loginForm.email"
            type="email"
            placeholder="Enter your email"
            required
            :disabled="isLoading"
            :class="{ error: validationErrors.email }"
            @blur="validateEmailField"
            @input="validationErrors.email && validateEmailField()"
          />
          <div v-if="validationErrors.email" class="field-error">
            {{ validationErrors.email }}
          </div>
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input
            id="password"
            v-model="loginForm.password"
            type="password"
            placeholder="Enter your password"
            required
            :disabled="isLoading"
            :class="{ error: validationErrors.password }"
            @blur="validatePasswordField"
            @input="validationErrors.password && validatePasswordField()"
          />
          <div v-if="validationErrors.password" class="field-error">
            {{ validationErrors.password }}
          </div>
        </div>

        <div class="form-options">
          <label class="checkbox-label">
            <input
              type="checkbox"
              v-model="loginForm.rememberMe"
              :disabled="isLoading"
            />
            <span>Remember me</span>
          </label>
          <a href="#" class="forgot-password">Forgot password?</a>
        </div>

        <button type="submit" class="login-button" :disabled="isLoading">
          <span v-if="isLoading">Signing in...</span>
          <span v-else>Sign In</span>
        </button>
      </form>

      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'guest'
})

// Form data
const loginForm = reactive({
  email: '',
  password: '',
  rememberMe: true
})

// Loading and error states
const isLoading = ref(false)
const errorMessage = ref('')

// Validation errors
const validationErrors = reactive({
  email: '',
  password: ''
})

// Validation functions
const validateEmail = (email) => {
  if (!email) {
    return 'Email is required'
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address'
  }
  return ''
}

const validatePassword = (password) => {
  if (!password) {
    return 'Password is required'
  }
  return ''
}

const validateForm = () => {
  validationErrors.email = validateEmail(loginForm.email)
  validationErrors.password = validatePassword(loginForm.password)

  return !validationErrors.email && !validationErrors.password
}

// Real-time validation
const validateEmailField = () => {
  validationErrors.email = validateEmail(loginForm.email)
}

const validatePasswordField = () => {
  validationErrors.password = validatePassword(loginForm.password)
}

// Handle login submission
const handleLogin = async () => {
  // Validate form before submission
  if (!validateForm()) {
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  try {
    const { signIn } = useAuth()
    await signIn(loginForm.email, loginForm.password, loginForm.rememberMe)
    await navigateTo('/')
  } catch (error) {
    errorMessage.value =
      error.data?.message || 'Login failed. Please check your credentials.'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  background-color: var(--color-background);
}

.login-card {
  background: white;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.login-header h2 {
  color: var(--color-text);
  margin-bottom: 8px;
  font-weight: 600;
}

.login-header p {
  color: var(--color-grayscale-70);
  font-size: 1.4rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  color: var(--color-text);
  font-weight: 500;
  font-size: 1.4rem;
}

.form-group input {
  padding: 12px 16px;
  border: 1px solid var(--color-grayscale-30);
  border-radius: 8px;
  font-size: 1.6rem;
  transition: border-color 0.2s ease;
  font-family: 'SVN-Circular', sans-serif;
}

.form-group input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(236, 88, 37, 0.1);
}

.form-group input:disabled {
  background-color: var(--color-bg-disabled);
  cursor: not-allowed;
}

.form-group input.error {
  border-color: var(--color-error);
  box-shadow: 0 0 0 3px rgba(244, 0, 59, 0.1);
}

.field-error {
  color: var(--color-error);
  font-size: 1.2rem;
  margin-top: 4px;
  font-weight: 400;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 8px 0;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 1.4rem;
  color: var(--color-text);
}

.checkbox-label input[type='checkbox'] {
  width: 16px;
  height: 16px;
  accent-color: var(--color-primary);
  cursor: pointer;
}

.forgot-password {
  color: var(--color-primary);
  font-size: 1.4rem;
  text-decoration: none;
  font-weight: 500;
}

.forgot-password:hover {
  text-decoration: underline;
}

.login-button {
  background-color: var(--color-primary);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 1.6rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
  font-family: 'SVN-Circular', sans-serif;
  margin-top: 8px;
}

.login-button:hover:not(:disabled) {
  background-color: var(--color-primary-light);
}

.login-button:disabled {
  background-color: var(--color-bg-disabled);
  cursor: not-allowed;
}

.error-message {
  background-color: rgba(244, 0, 59, 0.1);
  color: var(--color-error);
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 1.4rem;
  margin-top: 16px;
  border: 1px solid rgba(244, 0, 59, 0.2);
}

.login-footer {
  text-align: center;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid var(--color-grayscale-30);
}

.login-footer p {
  color: var(--color-grayscale-70);
  font-size: 1.4rem;
}

.login-footer a {
  color: var(--color-primary);
  font-weight: 500;
  text-decoration: none;
}

.login-footer a:hover {
  text-decoration: underline;
}

/* Responsive design */
@media (max-width: 768px) {
  .login-card {
    padding: 24px;
    margin: 0 16px;
  }

  .form-options {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }
}
</style>
