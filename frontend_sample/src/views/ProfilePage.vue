<template>
  <div>
    <AppHeader />
    
    <div class="container-custom py-12">
      <div class="max-w-3xl mx-auto bg-white shadow-sm rounded-lg overflow-hidden">
        <div class="bg-primary text-white py-6 px-8">
          <h1 class="text-2xl font-bold">
            User Profile
          </h1>
        </div>
        
        <div class="p-8">
          <!-- Profile Info -->
          <div class="flex flex-col md:flex-row items-start mb-10">
            <div class="md:w-1/4 flex justify-center mb-6 md:mb-0">
              <div class="relative">
                <img 
                  :src="user.avatar || 'https://via.placeholder.com/150?text=User'" 
                  alt="User Avatar" 
                  class="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
                >
                <button 
                  class="absolute bottom-0 right-0 bg-primary text-white rounded-full p-2 shadow-md hover:bg-primary-hover"
                  title="Change avatar"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </button>
              </div>
            </div>
            
            <div class="md:w-3/4">
              <form
                class="space-y-6"
                @submit.prevent="updateProfile"
              >
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      for="firstName"
                      class="block text-sm font-medium text-gray-700 mb-1"
                    >First Name</label>
                    <input 
                      id="firstName" 
                      v-model="user.firstName" 
                      type="text" 
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                  </div>
                  
                  <div>
                    <label
                      for="lastName"
                      class="block text-sm font-medium text-gray-700 mb-1"
                    >Last Name</label>
                    <input 
                      id="lastName" 
                      v-model="user.lastName" 
                      type="text" 
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                  </div>
                  
                  <div>
                    <label
                      for="email"
                      class="block text-sm font-medium text-gray-700 mb-1"
                    >Email Address</label>
                    <input 
                      id="email" 
                      v-model="user.email" 
                      type="email" 
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      readonly
                    >
                  </div>
                  
                  <div>
                    <label
                      for="phone"
                      class="block text-sm font-medium text-gray-700 mb-1"
                    >Phone Number</label>
                    <input 
                      id="phone" 
                      v-model="user.phone" 
                      type="tel" 
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                  </div>
                </div>
                
                <div>
                  <label
                    for="address"
                    class="block text-sm font-medium text-gray-700 mb-1"
                  >Address</label>
                  <textarea 
                    id="address" 
                    v-model="user.address" 
                    rows="3"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                
                <div class="flex justify-end">
                  <button
                    type="submit"
                    class="btn btn-primary"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
          
          <!-- Change Password -->
          <div class="border-t border-gray-200 pt-8 mt-8">
            <h2 class="text-xl font-semibold mb-6">
              Change Password
            </h2>
            <form
              class="max-w-lg space-y-6"
              @submit.prevent="changePassword"
            >
              <div>
                <label
                  for="currentPassword"
                  class="block text-sm font-medium text-gray-700 mb-1"
                >Current Password</label>
                <input 
                  id="currentPassword" 
                  v-model="passwordData.current" 
                  type="password" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
              </div>
              
              <div>
                <label
                  for="newPassword"
                  class="block text-sm font-medium text-gray-700 mb-1"
                >New Password</label>
                <input 
                  id="newPassword" 
                  v-model="passwordData.new" 
                  type="password" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
              </div>
              
              <div>
                <label
                  for="confirmPassword"
                  class="block text-sm font-medium text-gray-700 mb-1"
                >Confirm New Password</label>
                <input 
                  id="confirmPassword" 
                  v-model="passwordData.confirm" 
                  type="password" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
              </div>
              
              <div class="flex justify-end">
                <button
                  type="submit"
                  class="btn btn-primary"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    
    <AppFooter />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import AppHeader from '../components/AppHeader.vue';
import AppFooter from '../components/AppFooter.vue';

// Mock user data
const user = ref({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  phone: '+1 (555) 987-6543',
  address: '123 Library St, Book City, BC 12345',
  avatar: 'https://via.placeholder.com/150?text=John'
});

const passwordData = ref({
  current: '',
  new: '',
  confirm: ''
});

const updateProfile = async () => {
  try {
    // In a real app, send API request to update profile
    // await axios.put('/api/users/profile', user.value);
    
    alert('Profile updated successfully!');
  } catch (error) {
    console.error('Error updating profile:', error);
    alert('Failed to update profile. Please try again.');
  }
};

const changePassword = async () => {
  try {
    // Check if passwords match
    if (passwordData.value.new !== passwordData.value.confirm) {
      alert('New passwords do not match!');
      return;
    }
    
    // In a real app, send API request to change password
    // await axios.put('/api/users/change-password', passwordData.value);
    
    // Reset form
    passwordData.value = {
      current: '',
      new: '',
      confirm: ''
    };
    
    alert('Password changed successfully!');
  } catch (error) {
    console.error('Error changing password:', error);
    alert('Failed to change password. Please try again.');
  }
};
</script>