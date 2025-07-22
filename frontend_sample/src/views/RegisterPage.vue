<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <div class="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <div class="text-center mb-8">
          <img
            src="/assets/images/logo.png"
            alt="CodeX Logo"
            class="h-12 mx-auto mb-4"
            onerror="this.src='/assets/images/fallback-logo.png'; this.onerror=null;"
          >
          <h2 class="text-3xl font-bold text-text-dark">
            Create your account
          </h2>
          <p class="mt-2 text-sm text-gray-600">
            Join CodeX and gain access to our book collection.
          </p>
        </div>
        
        <form class="space-y-6" @submit.prevent="handleRegister">
          <div v-if="error" class="bg-red-50 border border-red-200 text-red-800 rounded-md p-3 text-sm">
            {{ error }}
          </div>
          
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700 mb-1">
              Full name
            </label>
            <input
              id="name"
              v-model="name"
              type="text"
              autocomplete="name"
              required
              class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary"
            >
          </div>
          
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
              Email address
            </label>
            <input
              id="email"
              v-model="email"
              type="email"
              autocomplete="email"
              required
              class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary"
            >
          </div>
          
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              v-model="password"
              type="password"
              autocomplete="new-password"
              required
              class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary"
            >
          </div>
          
          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-1">
              Confirm password
            </label>
            <input
              id="confirmPassword"
              v-model="confirmPassword"
              type="password"
              autocomplete="new-password"
              required
              class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary"
            >
          </div>
          
          <div class="flex items-center">
            <input
              id="terms"
              v-model="acceptTerms"
              type="checkbox"
              required
              class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            >
            <label for="terms" class="ml-2 block text-sm text-gray-700">
              I accept the <a href="#" class="text-primary hover:text-primary-hover">Terms of Service</a> and <a href="#" class="text-primary hover:text-primary-hover">Privacy Policy</a>
            </label>
          </div>
          
          <div>
            <button
              type="submit"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              :disabled="isLoading"
            >
              <span v-if="isLoading" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating account...
              </span>
              <span v-else>Create account</span>
            </button>
          </div>
        </form>
        
        <div class="mt-6 text-center">
          <p class="text-sm text-gray-600">
            Already have an account?
            <router-link to="/login" class="font-medium text-primary hover:text-primary-hover">
              Sign in
            </router-link>
          </p>
        </div>
      </div>
    </div>
    
    <AppFooter />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import AppFooter from '../components/AppFooter.vue';

const router = useRouter();
const name = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const acceptTerms = ref(false);
const isLoading = ref(false);
const error = ref('');

const handleRegister = async () => {
  // Basic form validation
  if (!name.value || !email.value || !password.value || !confirmPassword.value) {
    error.value = 'Please fill in all fields.';
    return;
  }
  
  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match.';
    return;
  }
  
  if (!acceptTerms.value) {
    error.value = 'You must accept the terms and conditions.';
    return;
  }
  
  isLoading.value = true;
  error.value = '';
  
  try {
    // For demo, simulate API call with timeout
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real app, you would call your registration API:
    // const response = await axios.post('/api/auth/register', {
    //   name: name.value,
    //   email: email.value,
    //   password: password.value
    // });
    
    // For demo purposes, simulate a successful registration
    alert(`Account created for ${name.value}! Please sign in.`);
    router.push('/login');
    
  } catch (err) {
    console.error('Registration error:', err);
    error.value = 'An error occurred during registration. Please try again.';
  } finally {
    isLoading.value = false;
  }
};
</script>