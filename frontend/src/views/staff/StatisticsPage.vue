<template>
  <StaffLayout>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold text-gray-900">Thống kê hệ thống</h1>

        <!-- Time Range Filter -->
        <div class="flex items-center space-x-4">
          <select
            v-model="timeRange"
            @change="handleReload"
            class="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
          >
            <option value="week">7 ngày qua</option>
            <option value="month">30 ngày qua</option>
            <option value="quarter">3 tháng qua</option>
            <option value="year">12 tháng qua</option>
          </select>

          <button
            @click="handleReload"
            class="bg-primary text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center"
          >
            <i class="pi pi-refresh mr-2"></i>
            Làm mới
          </button>
        </div>
      </div>

      <!-- Tabs -->
      <div class="bg-white rounded-lg shadow-sm">
        <div class="border-b border-gray-200">
          <nav class="-mb-px flex space-x-8 px-6">
            <button
              @click="activeTab = 'borrows'"
              :class="[
                activeTab === 'borrows'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors',
              ]"
            >
              <i class="pi pi-book mr-2"></i>
              Thống kê mượn/trả
            </button>
            <button
              @click="activeTab = 'books'"
              :class="[
                activeTab === 'books'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors',
              ]"
            >
              <i class="pi pi-folder mr-2"></i>
              Thống kê sách
            </button>
            <button
              @click="activeTab = 'users'"
              :class="[
                activeTab === 'users'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors',
              ]"
            >
              <i class="pi pi-users mr-2"></i>
              Thống kê người dùng
            </button>
          </nav>
        </div>

        <!-- Tab Content -->
        <div class="p-6">
          <!-- Borrow/Return Statistics -->
          <div v-if="activeTab === 'borrows'" class="space-y-6">
            <!-- Summary Cards -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div class="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div class="flex items-center">
                  <div class="p-2 bg-blue-100 rounded-lg">
                    <i class="pi pi-book text-blue-600"></i>
                  </div>
                  <div class="ml-3">
                    <p class="text-sm font-medium text-blue-600">
                      Tổng lượt mượn
                    </p>
                    <p class="text-xl font-bold text-blue-900">
                      {{ borrowStats.total }}
                    </p>
                  </div>
                </div>
              </div>

              <div class="bg-green-50 rounded-lg p-4 border border-green-200">
                <div class="flex items-center">
                  <div class="p-2 bg-green-100 rounded-lg">
                    <i class="pi pi-check text-green-600"></i>
                  </div>
                  <div class="ml-3">
                    <p class="text-sm font-medium text-green-600">
                      Trả đúng hạn
                    </p>
                    <p class="text-xl font-bold text-green-900">
                      {{ borrowStats.onTime }}
                    </p>
                  </div>
                </div>
              </div>

              <div class="bg-red-50 rounded-lg p-4 border border-red-200">
                <div class="flex items-center">
                  <div class="p-2 bg-red-100 rounded-lg">
                    <i class="pi pi-clock text-red-600"></i>
                  </div>
                  <div class="ml-3">
                    <p class="text-sm font-medium text-red-600">Trả trễ hạn</p>
                    <p class="text-xl font-bold text-red-900">
                      {{ borrowStats.overdue }}
                    </p>
                  </div>
                </div>
              </div>

              <div class="bg-purple-50 rounded-lg p-4 border border-purple-200">
                <div class="flex items-center">
                  <div class="p-2 bg-purple-100 rounded-lg">
                    <i class="pi pi-calendar text-purple-600"></i>
                  </div>
                  <div class="ml-3">
                    <p class="text-sm font-medium text-purple-600">Đang mượn</p>
                    <p class="text-xl font-bold text-purple-900">
                      {{ borrowStats.active }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Charts Row 1 -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <!-- Borrow Trend Chart -->
              <div class="bg-white border border-gray-200 rounded-lg p-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">
                  Xu hướng mượn sách
                </h3>
                <div class="h-80">
                  <Line
                    ref="borrowTrendChart"
                    :data="borrowTrendData"
                    :options="chartOptions.line"
                  />
                </div>
              </div>

              <!-- Return Status Chart -->
              <div class="bg-white border border-gray-200 rounded-lg p-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">
                  Tình trạng trả sách
                </h3>
                <div class="h-80">
                  <Doughnut
                    ref="returnStatusChart"
                    :data="returnStatusData"
                    :options="chartOptions.doughnut"
                  />
                </div>
              </div>
            </div>

            <!-- Charts Row 2 -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <!-- Borrow Status Chart -->
              <div class="bg-white border border-gray-200 rounded-lg p-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">
                  Trạng thái mượn sách
                </h3>
                <div class="h-80">
                  <Bar
                    ref="borrowStatusChart"
                    :data="borrowStatusData"
                    :options="chartOptions.bar"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Book Statistics -->
          <div v-if="activeTab === 'books'" class="space-y-6">
            <!-- Summary Cards -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div class="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
                <div class="flex items-center">
                  <div class="p-2 bg-indigo-100 rounded-lg">
                    <i class="pi pi-folder text-indigo-600"></i>
                  </div>
                  <div class="ml-3">
                    <p class="text-sm font-medium text-indigo-600">
                      Tổng số sách
                    </p>
                    <p class="text-xl font-bold text-indigo-900">
                      {{ bookStats.total }}
                    </p>
                  </div>
                </div>
              </div>

              <div class="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                <div class="flex items-center">
                  <div class="p-2 bg-yellow-100 rounded-lg">
                    <i class="pi pi-book text-yellow-600"></i>
                  </div>
                  <div class="ml-3">
                    <p class="text-sm font-medium text-yellow-600">Đang mượn</p>
                    <p class="text-xl font-bold text-yellow-900">
                      {{ bookStats.borrowed }}
                    </p>
                  </div>
                </div>
              </div>

              <div class="bg-green-50 rounded-lg p-4 border border-green-200">
                <div class="flex items-center">
                  <div class="p-2 bg-green-100 rounded-lg">
                    <i class="pi pi-check-circle text-green-600"></i>
                  </div>
                  <div class="ml-3">
                    <p class="text-sm font-medium text-green-600">Khả dụng</p>
                    <p class="text-xl font-bold text-green-900">
                      {{ bookStats.available }}
                    </p>
                  </div>
                </div>
              </div>

              <div class="bg-orange-50 rounded-lg p-4 border border-orange-200">
                <div class="flex items-center">
                  <div class="p-2 bg-orange-100 rounded-lg">
                    <i class="pi pi-tags text-orange-600"></i>
                  </div>
                  <div class="ml-3">
                    <p class="text-sm font-medium text-orange-600">Thể loại</p>
                    <p class="text-xl font-bold text-orange-900">
                      {{ bookStats.categories }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Charts Row 1 -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <!-- Top Borrowed Books -->
              <div class="bg-white border border-gray-200 rounded-lg p-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">
                  Top sách được mượn nhiều nhất
                </h3>
                <div class="space-y-3">
                  <div
                    v-for="(book, index) in topBorrowedBooks"
                    :key="book.bookId"
                    class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div class="flex items-center">
                      <div
                        :class="getRankClass(index)"
                        class="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white mr-3"
                      >
                        {{ index + 1 }}
                      </div>
                      <div>
                        <p class="font-medium text-gray-900">
                          {{ book.title }}
                        </p>
                        <p class="text-sm text-gray-600">{{ book.author }}</p>
                      </div>
                    </div>
                    <div class="text-right">
                      <p class="font-bold text-gray-900">
                        {{ book.borrowCount }}
                      </p>
                      <p class="text-sm text-gray-600">lượt mượn</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Book Availability Chart -->
              <div class="bg-white border border-gray-200 rounded-lg p-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">
                  Tình trạng sách
                </h3>
                <div class="h-80">
                  <Pie
                    ref="bookAvailabilityChart"
                    :data="bookAvailabilityData"
                    :options="chartOptions.pie"
                  />
                </div>
              </div>
            </div>

            <!-- Category Statistics -->
            <div class="bg-white border border-gray-200 rounded-lg p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">
                Thống kê theo thể loại
              </h3>
              <div class="h-[580px]">
                <Bar
                  ref="categoryStatsChart"
                  :data="categoryStatsData"
                  :options="chartOptions.categoryBar"
                />
              </div>
            </div>
          </div>

          <!-- User Statistics -->
          <div v-if="activeTab === 'users'" class="space-y-6">
            <!-- Summary Cards -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div class="bg-cyan-50 rounded-lg p-4 border border-cyan-200">
                <div class="flex items-center">
                  <div class="p-2 bg-cyan-100 rounded-lg">
                    <i class="pi pi-users text-cyan-600"></i>
                  </div>
                  <div class="ml-3">
                    <p class="text-sm font-medium text-cyan-600">
                      Tổng người dùng
                    </p>
                    <p class="text-xl font-bold text-cyan-900">
                      {{ userStats.total }}
                    </p>
                  </div>
                </div>
              </div>

              <div class="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div class="flex items-center">
                  <div class="p-2 bg-blue-100 rounded-lg">
                    <i class="pi pi-user text-blue-600"></i>
                  </div>
                  <div class="ml-3">
                    <p class="text-sm font-medium text-blue-600">Độc giả</p>
                    <p class="text-xl font-bold text-blue-900">
                      {{ userStats.readers }}
                    </p>
                  </div>
                </div>
              </div>

              <div class="bg-purple-50 rounded-lg p-4 border border-purple-200">
                <div class="flex items-center">
                  <div class="p-2 bg-purple-100 rounded-lg">
                    <i class="pi pi-shield text-purple-600"></i>
                  </div>
                  <div class="ml-3">
                    <p class="text-sm font-medium text-purple-600">Nhân viên</p>
                    <p class="text-xl font-bold text-purple-900">
                      {{ userStats.staff }}
                    </p>
                  </div>
                </div>
              </div>

              <div class="bg-green-50 rounded-lg p-4 border border-green-200">
                <div class="flex items-center">
                  <div class="p-2 bg-green-100 rounded-lg">
                    <i class="pi pi-user-plus text-green-600"></i>
                  </div>
                  <div class="ml-3">
                    <p class="text-sm font-medium text-green-600">
                      Mới tháng này
                    </p>
                    <p class="text-xl font-bold text-green-900">
                      {{ userStats.newThisMonth }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Charts Row 1 -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <!-- User Role Distribution -->
              <div class="bg-white border border-gray-200 rounded-lg p-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">
                  Phân bố theo vai trò
                </h3>
                <div class="h-80">
                  <Doughnut
                    ref="userRoleChart"
                    :data="userRoleData"
                    :options="chartOptions.doughnut"
                  />
                </div>
              </div>

              <!-- New User Registration -->
              <div class="bg-white border border-gray-200 rounded-lg p-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">
                  Đăng ký mới theo tháng
                </h3>
                <div class="h-80">
                  <Line
                    ref="newUserChart"
                    :data="newUserData"
                    :options="chartOptions.line"
                  />
                </div>
              </div>
            </div>

            <!-- Top Borrowers -->
            <div class="bg-white border border-gray-200 rounded-lg p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">
                Top người mượn nhiều nhất
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div
                  v-for="(user, index) in topBorrowers"
                  :key="user.id"
                  class="flex items-center p-4 bg-gray-50 rounded-lg"
                >
                  <div
                    :class="getRankClass(index)"
                    class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white mr-4"
                  >
                    {{ index + 1 }}
                  </div>
                  <div class="flex-1">
                    <p class="font-medium text-gray-900">{{ user.name }}</p>
                    <p class="text-sm text-gray-600">{{ user.email }}</p>
                    <p class="text-sm font-semibold text-primary">
                      {{ user.borrowCount }} lượt mượn
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </StaffLayout>
</template>
<script setup>
import { ref, reactive, onMounted, watch } from "vue";
import StaffLayout from "@/layouts/StaffLayout.vue";
import { statisticsService } from "@/services";
import { nextTick } from "vue";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Line, Bar, Doughnut, Pie } from "vue-chartjs";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const activeTab = ref("");
const timeRange = ref("month");
const loading = ref(false);

// Statistics data
const borrowStats = ref({
  total: 0,
  onTime: 0,
  overdue: 0,
  active: 0,
});

const bookStats = ref({
  total: 0,
  borrowed: 0,
  available: 0,
  categories: 0,
});

const userStats = ref({
  total: 0,
  readers: 0,
  staff: 0,
  newThisMonth: 0,
});

const topBorrowedBooks = ref([]);
const topBorrowers = ref([]);

// Chart data với dữ liệu mặc định
const borrowTrendData = ref({
  labels: [],
  datasets: [
    {
      label: "Số lượt mượn",
      data: [],
      borderColor: "#e60012",
      backgroundColor: "rgba(230, 0, 18, 0.1)",
      tension: 0.4,
    },
  ],
});

const returnStatusData = ref({
  labels: ["Trả đúng hạn", "Trả trễ hạn", "Chưa trả"],
  datasets: [
    {
      data: [0, 0, 0],
      backgroundColor: ["#10b981", "#f59e0b", "#ef4444"],
      hoverBackgroundColor: ["#059669", "#d97706", "#dc2626"],
    },
  ],
});

const borrowStatusData = ref({
  labels: ["Đã trả", "Bị từ chối", "Đã hủy"],
  datasets: [
    {
      label: "Số lượng",
      data: [0, 0, 0],
      backgroundColor: ["#10b981", "#ef4444", "#6b7280"],
    },
  ],
});

const bookAvailabilityData = ref({
  labels: ["Khả dụng", "Đang mượn", "Không khả dụng"],
  datasets: [
    {
      data: [0, 0, 0],
      backgroundColor: ["#10b981", "#f59e0b", "#ef4444"],
    },
  ],
});

const categoryStatsData = ref({
  labels: [],
  datasets: [
    {
      label: "Số sách",
      data: [],
      backgroundColor: "#3b82f6",
    },
    {
      label: "Lượt mượn",
      data: [],
      backgroundColor: "#e60012",
    },
  ],
});

const userRoleData = ref({
  labels: ["Độc giả", "Nhân viên"],
  datasets: [
    {
      data: [0, 0],
      backgroundColor: ["#3b82f6", "#8b5cf6"],
    },
  ],
});

const newUserData = ref({
  labels: [],
  datasets: [
    {
      label: "Người dùng mới",
      data: [],
      borderColor: "#10b981",
      backgroundColor: "rgba(16, 185, 129, 0.1)",
      tension: 0.4,
    },
  ],
});

// Chart options
const chartOptions = reactive({
  line: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => {
            return Number.isInteger(value) ? value : "";
          },
        },
      },
    },
  },
  bar: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => {
            return Number.isInteger(value) ? value : "";
          },
        },
      },
    },
  },
  categoryBar: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    indexAxis: "y",
  },
  doughnut: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  },
  pie: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  },
});

// Helper functions
const getRankClass = (index) => {
  const classes = [
    "bg-yellow-500", // 1st place - gold
    "bg-gray-400", // 2nd place - silver
    "bg-orange-600", // 3rd place - bronze
  ];
  return classes[index] || "bg-blue-500";
};

const handleReload = async () => {
  const curTab = activeTab.value;
  activeTab.value = "";
  await refreshData();
  activeTab.value = curTab; // Preserve active tab after refresh
};

const refreshData = async () => {
  loading.value = true;
  try {
    await Promise.all([
      fetchBorrowStatistics(),
      fetchBookStatistics(),
      fetchUserStatistics(),
    ]);
    // Force chart update after data load
    await nextTick();
    updateCharts();
  } catch (error) {
    console.error("Error refreshing data:", error);
    alert("Có lỗi xảy ra khi tải dữ liệu thống kê: " + error.message);
  } finally {
    loading.value = false;
  }
};

const fetchBorrowStatistics = async () => {
  try {
    const response = await statisticsService.getBorrowStatistics(
      timeRange.value
    );
    console.log("Borrow statistics response:", response);

    const data = response.data;

    // Update summary stats
    borrowStats.value = {
      total: data.summary?.total || 0,
      onTime: data.summary?.onTime || 0,
      overdue: data.summary?.overdue || 0,
      active: data.summary?.active || 0,
    };

    // Update chart data
    if (data.trend) {
      borrowTrendData.value.labels = data.trend.labels || [];
      borrowTrendData.value.datasets[0].data = data.trend.data || [];
    }

    returnStatusData.value.datasets[0].data = [
      data.summary?.onTime || 0,
      data.summary?.overdue || 0,
      data.summary?.active || 0,
    ];

    if (data.status) {
      borrowStatusData.value.datasets[0].data = [
        data.status.returned || 0,
        data.status.rejected || 0,
        data.status.cancelled || 0,
      ];
    }
  } catch (error) {
    console.error("Error fetching borrow statistics:", error);
    // Set default values on error
    borrowStats.value = { total: 0, onTime: 0, overdue: 0, active: 0 };
  }
};

const fetchBookStatistics = async () => {
  try {
    const response = await statisticsService.getBookStatistics();
    const data = response.data;

    // Update summary stats
    bookStats.value = {
      total: data.summary?.total || 0,
      borrowed: data.summary?.borrowed || 0,
      available: data.summary?.available || 0,
      categories: data.summary?.categories || 0,
    };

    // Update top borrowed books
    topBorrowedBooks.value = data.topBorrowed || [];

    // Update chart data
    if (data.availability) {
      bookAvailabilityData.value.datasets[0].data = [
        data.availability.available || 0,
        data.availability.borrowed || 0,
        data.availability.unavailable || 0,
      ];
    }

    if (data.categoryStats) {
      categoryStatsData.value.labels = data.categoryStats.labels || [];
      categoryStatsData.value.datasets[0].data =
        data.categoryStats.bookCounts || [];
      categoryStatsData.value.datasets[1].data =
        data.categoryStats.borrowCounts || [];
    }
  } catch (error) {
    console.error("Error fetching book statistics:", error);
    bookStats.value = { total: 0, borrowed: 0, available: 0, categories: 0 };
  }
};

const fetchUserStatistics = async () => {
  try {
    const response = await statisticsService.getUserStatistics(timeRange.value);
    const data = response.data;

    // Update summary stats
    userStats.value = {
      total: data.summary?.total || 0,
      readers: data.summary?.readers || 0,
      staff: data.summary?.staff || 0,
      newThisMonth: data.summary?.newThisMonth || 0,
    };

    // Update top borrowers
    topBorrowers.value = data.topBorrowers || [];

    // Update chart data
    if (data.roleDistribution) {
      userRoleData.value.datasets[0].data = [
        data.roleDistribution.readers || 0,
        data.roleDistribution.staff || 0,
      ];
    }

    if (data.newUserTrend) {
      newUserData.value.labels = data.newUserTrend.labels || [];
      newUserData.value.datasets[0].data = data.newUserTrend.data || [];
    }
  } catch (error) {
    console.error("Error fetching user statistics:", error);
    userStats.value = { total: 0, readers: 0, staff: 0, newThisMonth: 0 };
  }
};

// Update charts after data changes
const updateCharts = () => {
  setTimeout(() => {
    const charts = document.querySelectorAll("canvas");
    charts.forEach((canvas) => {
      const chart = ChartJS.getChart(canvas);
      if (chart) {
        chart.update();
        chart.resize();
      }
    });
  }, 100);
};

watch(activeTab, (newTab) => {
  updateCharts();
});

onMounted(async () => {
  await refreshData();
  activeTab.value = "borrows";
});
</script>
