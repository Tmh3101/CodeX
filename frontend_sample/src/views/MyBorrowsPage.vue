<template>
  <div>
    <AppHeader />
    
    <div class="container-custom py-12">
      <h1 class="text-3xl font-bold mb-6 text-center">
        My Borrowed Books
      </h1>
      
      <div
        v-if="loading"
        class="flex justify-center py-10"
      >
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
      
      <!-- Tabs -->
      <div v-else class="mb-6">
        <div class="flex border-b">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            class="py-2 px-4 font-medium text-sm focus:outline-none"
            :class="activeTab === tab.id ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'"
            @click="activeTab = tab.id"
          >
            {{ tab.name }}
            <span v-if="getFilteredBorrows(tab.id).length" class="ml-1 bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs">
              {{ getFilteredBorrows(tab.id).length }}
            </span>
          </button>
        </div>
      </div>
      
      <div
        v-if="getFilteredBorrows(activeTab).length === 0"
        class="text-center py-16 bg-white rounded-lg shadow-sm"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-16 w-16 text-gray-400 mx-auto mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
        <h2 class="text-xl font-semibold mb-2">
          No Books in This Category
        </h2>
        <p class="text-gray-600 mb-6">
          {{ getEmptyMessage(activeTab) }}
        </p>
        <router-link
          to="/"
          class="btn btn-primary"
        >
          Browse Books
        </router-link>
      </div>
      
      <div
        v-else
        class="bg-white rounded-lg shadow-sm overflow-hidden"
      >
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Book
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Borrow Date
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Due Date
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="borrow in getFilteredBorrows(activeTab)"
              :key="borrow._id"
            >
              <td class="px-6 py-4">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <img
                      class="h-10 w-10 rounded"
                      :src="borrow.book.coverUrl || 'https://via.placeholder.com/40x40?text=Book'"
                      :alt="borrow.book.title"
                    >
                  </div>
                  <div class="ml-4">
                    <div class="font-medium text-gray-900 hover:text-primary">
                      <router-link :to="`/books/${borrow.book.bookId}`">
                        {{ borrow.book.title }}
                      </router-link>
                    </div>
                    <div class="text-sm text-gray-500">
                      {{ book.authors.length ? book.authors.join(', ') : 'Unknown' }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 text-sm text-gray-500">
                {{ formatDate(borrow.borrowDate) }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-500">
                {{ formatDate(borrow.returnDate) }}
              </td>
              <td class="px-6 py-4 text-sm">
                <span 
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="getStatusClass(borrow.status)"
                >
                  {{ borrow.status }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm">
                <button 
                  v-if="borrow.status === 'Borrowed'" 
                  class="text-primary hover:text-primary-hover font-medium" 
                  @click="returnBook(borrow._id)"
                >
                  Return
                </button>
                <span
                  v-else
                  class="text-gray-400"
                >-</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <AppFooter />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import AppHeader from '../components/AppHeader.vue';
import AppFooter from '../components/AppFooter.vue';

const borrows = ref([]);
const loading = ref(true);
const activeTab = ref('active');

const tabs = [
  { id: 'active', name: 'Active' },
  { id: 'overdue', name: 'Overdue' },
  { id: 'history', name: 'History' }
];

import borrows_data from '../mockup_data/borrows.json'
onMounted(async () => {
  try {
    // In a real app, fetch borrows from API
    // const response = await axios.get('/api/borrows');
    // borrows.value = response.data;
    borrows.value = borrows_data;
    
    // Check for overdue books (demo purposes only)
    borrows.value.forEach(borrow => {
      if (borrow.status === 'Borrowed') {
        const dueDate = new Date(borrow.returnDate);
        const today = new Date();
        if (dueDate < today) {
          borrow.status = 'Overdue';
        }
      }
    });
    
  } catch (error) {
    console.error('Error fetching borrows:', error);
  } finally {
    loading.value = false;
  }
});

const getFilteredBorrows = (tabId) => {
  switch (tabId) {
    case 'active':
      return borrows.value.filter(borrow => borrow.status === 'Borrowed');
    case 'overdue':
      return borrows.value.filter(borrow => borrow.status === 'Overdue');
    case 'history':
      return borrows.value.filter(borrow => borrow.status === 'Returned');
    default:
      return borrows.value;
  }
};

const getEmptyMessage = (tabId) => {
  switch (tabId) {
    case 'active':
      return "You don't have any active borrowed books at the moment.";
    case 'overdue':
      return "You don't have any overdue books. Keep up the good work!";
    case 'history':
      return "You haven't returned any books yet.";
    default:
      return "No books found in this category.";
  }
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const getStatusClass = (status) => {
  switch (status) {
    case 'Borrowed':
      return 'bg-blue-100 text-blue-800';
    case 'Returned':
      return 'bg-green-100 text-green-800';
    case 'Overdue':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const returnBook = async (borrowId) => {
  try {
    // In a real app, call API to return book
    // await axios.put(`/api/borrows/${borrowId}/return`);
    
    // For demo purposes, just update local state
    const borrowIndex = borrows.value.findIndex(b => b.borrowId === borrowId);
    if (borrowIndex !== -1) {
      borrows.value[borrowIndex].status = 'Returned';
    }
    
    alert('Book returned successfully!');
  } catch (error) {
    console.error('Error returning book:', error);
    alert('Failed to return book. Please try again.');
  }
};
</script>