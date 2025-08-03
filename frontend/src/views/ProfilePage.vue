<template>
  <div>
    <AppHeader />

    <div class="container-custom py-12">
      <div
        class="max-w-4xl mx-auto bg-white shadow-md rounded-lg overflow-hidden"
      >
        <!-- Header -->
        <div class="bg-primary text-white py-6 px-8">
          <h1 class="text-2xl font-bold">Thông tin cá nhân</h1>
          <p class="text-red-100 mt-1">Quản lý thông tin tài khoản của bạn</p>
        </div>

        <div class="p-8">
          <!-- Profile Overview -->
          <div class="flex flex-col lg:flex-row gap-8 mb-8">
            <!-- Avatar Section -->
            <div class="lg:w-1/3">
              <div class="text-center">
                <div class="relative inline-block">
                  <div
                    class="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-gray-200 shadow-lg"
                  >
                    <img
                      v-if="user?.user?.avatarUrl"
                      :src="user?.user?.avatarUrl"
                      alt="Avatar"
                      class="w-full h-full object-cover"
                    />
                    <div
                      v-else
                      class="w-full h-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center"
                    >
                      <span class="text-3xl font-bold text-white">
                        {{ getUserInitials() }}
                      </span>
                    </div>
                  </div>

                  <!-- Edit Avatar Button -->
                  <button
                    @click="triggerAvatarUpload"
                    class="absolute bottom-0 right-0 bg-primary text-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg hover:bg-red-700 transition-colors"
                    title="Thay đổi ảnh đại diện"
                  >
                    <i class="pi pi-pencil text-sm"></i>
                  </button>

                  <!-- Hidden file input -->
                  <input
                    ref="avatarInput"
                    type="file"
                    accept="image/*"
                    @change="handleAvatarUpload"
                    class="hidden"
                  />
                </div>

                <!-- Avatar Actions -->
                <div class="mt-4 space-y-2">
                  <button
                    v-if="user?.user?.avatarUrl"
                    @click="deleteAvatar"
                    class="w-full bg-red-100 text-red-600 px-4 py-2 rounded-md hover:bg-red-200 transition-colors text-sm"
                  >
                    <i class="pi pi-trash mr-2"></i>
                    Xóa ảnh
                  </button>
                </div>

                <!-- Upload Progress -->
                <div v-if="uploadingAvatar" class="mt-4">
                  <div class="bg-gray-200 rounded-full h-2">
                    <div
                      class="bg-primary h-2 rounded-full transition-all duration-300"
                      :style="`width: ${uploadProgress}%`"
                    ></div>
                  </div>
                  <p class="text-sm text-gray-600 mt-1">Đang tải lên...</p>
                </div>
              </div>
            </div>

            <!-- User Info Display -->
            <div class="lg:w-2/3">
              <div class="bg-gray-50 rounded-lg p-6">
                <div class="flex justify-between items-start mb-6">
                  <h2 class="text-xl font-semibold text-gray-900">
                    Thông tin cá nhân
                  </h2>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-500 mb-1"
                      >Họ và tên</label
                    >
                    <p class="text-gray-900 font-medium">
                      {{ user?.user?.firstName }} {{ user?.user?.lastName }}
                    </p>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-500 mb-1"
                      >Email</label
                    >
                    <p class="text-gray-900 font-medium">
                      {{ user?.user?.email }}
                    </p>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-500 mb-1"
                      >Số điện thoại</label
                    >
                    <p class="text-gray-900 font-medium">
                      {{ user?.user?.phone || "Chưa cập nhật" }}
                    </p>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-500 mb-1"
                      >Giới tính</label
                    >
                    <p class="text-gray-900 font-medium">
                      {{ getGenderText(user.gender) }}
                    </p>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-500 mb-1"
                      >Ngày sinh</label
                    >
                    <p class="text-gray-900 font-medium">
                      {{ formatDate(user?.user?.dateOfBirth) }}
                    </p>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-500 mb-1"
                      >Vai trò</label
                    >
                    <span
                      :class="getRoleClass(user?.user?.role)"
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    >
                      {{ getRoleText(user?.user?.role) }}
                    </span>
                  </div>
                </div>

                <div v-if="user.address" class="mt-6">
                  <label class="block text-sm font-medium text-gray-500 mb-1"
                    >Địa chỉ</label
                  >
                  <p class="text-gray-900 font-medium">{{ user.address }}</p>
                </div>
              </div>

              <!-- Quick Actions -->
              <div class="mt-6 flex flex-wrap gap-3">
                <button
                  @click="showEditModal = true"
                  class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm flex items-center"
                >
                  <i class="pi pi-user-edit mr-2"></i>
                  Chỉnh sửa thông tin
                </button>
                <button
                  @click="showPasswordModal = true"
                  class="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors text-sm flex items-center"
                >
                  <i class="pi pi-key mr-2"></i>
                  Đổi mật khẩu
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Profile Modal -->
    <div
      v-if="showEditModal"
      class="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4"
      @click="closeEditModal"
    >
      <div
        class="relative w-full max-w-2xl bg-white rounded-lg shadow-xl"
        @click.stop
      >
        <!-- Modal Header -->
        <div class="px-6 py-4 border-b border-gray-200 rounded-t-lg">
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-semibold text-gray-900">
              Chỉnh sửa thông tin
            </h2>
            <button
              @click="closeEditModal"
              class="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <i class="pi pi-times text-xl"></i>
            </button>
          </div>
        </div>

        <!-- Modal Body -->
        <div class="px-6 py-6">
          <form @submit.prevent="updateProfile" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Họ <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="editForm.firstName"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Tên <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="editForm.lastName"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  :value="editForm.email"
                  type="email"
                  readonly
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-500"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Số điện thoại
                </label>
                <input
                  v-model="editForm.phone"
                  type="tel"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Giới tính
                </label>
                <select
                  v-model="editForm.gender"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                >
                  <option value="">Chọn giới tính</option>
                  <option value="male">Nam</option>
                  <option value="female">Nữ</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Ngày sinh
                </label>
                <input
                  v-model="editForm.dateOfBirth"
                  type="date"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Địa chỉ
              </label>
              <textarea
                v-model="editForm.address"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary resize-none"
              ></textarea>
            </div>

            <!-- Form Actions -->
            <div
              class="flex justify-end space-x-3 pt-4 border-t border-gray-200"
            >
              <button
                type="button"
                @click="closeEditModal"
                class="px-6 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              >
                Hủy
              </button>
              <button
                type="submit"
                :disabled="updatingProfile"
                class="px-6 py-2 bg-primary text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
              >
                <i
                  v-if="updatingProfile"
                  class="pi pi-spin pi-spinner mr-2"
                ></i>
                {{ updatingProfile ? "Đang cập nhật..." : "Cập nhật" }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Change Password Modal -->
    <div
      v-if="showPasswordModal"
      class="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4"
      @click="closePasswordModal"
    >
      <div
        class="relative w-full max-w-md bg-white rounded-lg shadow-xl"
        @click.stop
      >
        <!-- Modal Header -->
        <div class="px-6 py-4 border-b border-gray-200 rounded-t-lg">
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-semibold text-gray-900">Đổi mật khẩu</h2>
            <button
              @click="closePasswordModal"
              class="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <i class="pi pi-times text-xl"></i>
            </button>
          </div>
        </div>

        <!-- Modal Body -->
        <div class="px-6 py-6">
          <form @submit.prevent="changePassword" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Mật khẩu hiện tại <span class="text-red-500">*</span>
              </label>
              <input
                v-model="passwordForm.currentPassword"
                type="password"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Mật khẩu mới <span class="text-red-500">*</span>
              </label>
              <input
                v-model="passwordForm.newPassword"
                type="password"
                required
                minlength="6"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Xác nhận mật khẩu mới <span class="text-red-500">*</span>
              </label>
              <input
                v-model="passwordForm.confirmPassword"
                type="password"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
              />
            </div>

            <!-- Form Actions -->
            <div
              class="flex justify-end space-x-3 pt-4 border-t border-gray-200"
            >
              <button
                type="button"
                @click="closePasswordModal"
                class="px-6 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              >
                Hủy
              </button>
              <button
                type="submit"
                :disabled="changingPassword"
                class="px-6 py-2 bg-primary text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
              >
                <i
                  v-if="changingPassword"
                  class="pi pi-spin pi-spinner mr-2"
                ></i>
                {{ changingPassword ? "Đang đổi..." : "Đổi mật khẩu" }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <AppFooter />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import AppHeader from "../components/AppHeader.vue";
import AppFooter from "../components/AppFooter.vue";
import { userService } from "@/services/userService";
import { useAuthStore } from "@/stores/auth";

const user = ref({});
const showEditModal = ref(false);
const showPasswordModal = ref(false);
const updatingProfile = ref(false);
const changingPassword = ref(false);
const uploadingAvatar = ref(false);
const uploadProgress = ref(0);

const avatarInput = ref(null);

const authStore = useAuthStore();
authStore.initialize();

console.log("User data:", authStore.user);

const editForm = reactive({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  gender: "",
  dateOfBirth: "",
  address: "",
});

const passwordForm = reactive({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});

// Fetch current user profile
const fetchUserProfile = () => {
  try {
    user.value = authStore.user;

    // Populate edit form
    Object.assign(editForm, {
      firstName: user.value.user.firstName || "",
      lastName: user.value.user.lastName || "",
      email: user.value.user.email || "",
      phone: user.value.user.phone || "",
      gender: user.value.gender || "",
      dateOfBirth: user.value.user.dateOfBirth
        ? user.value.user.dateOfBirth.split("T")[0]
        : "",
      address: user.value.user.address || "",
    });

    console.log("editForm:", editForm);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    alert("Có lỗi xảy ra khi tải thông tin người dùng");
  }
};

// Update profile
const updateProfile = async () => {
  try {
    updatingProfile.value = true;

    const editFormData = {
      firstName: editForm.firstName,
      lastName: editForm.lastName,
      phone: editForm.phone,
      gender: editForm.gender,
      dateOfBirth: editForm.dateOfBirth,
      address: editForm.address,
    };

    await userService.updateProfile(editFormData);

    // Update local user data
    Object.assign(user.value, editFormData);

    closeEditModal();
    alert("Cập nhật thông tin thành công!");
  } catch (error) {
    console.error("Error updating profile:", error);
    alert(
      "Có lỗi xảy ra khi cập nhật thông tin: " +
        (error.response?.data?.message || error.message)
    );
  } finally {
    updatingProfile.value = false;
  }
};

// Change password
const changePassword = async () => {
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    alert("Mật khẩu mới không khớp!");
    return;
  }

  try {
    changingPassword.value = true;
    await userService.changePassword({
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword,
    });

    closePasswordModal();
    resetPasswordForm();
    alert("Đổi mật khẩu thành công!");
  } catch (error) {
    console.error("Error changing password:", error);
    alert(
      "Có lỗi xảy ra khi đổi mật khẩu: " +
        (error.response?.data?.message || error.message)
    );
  } finally {
    changingPassword.value = false;
  }
};

// Avatar upload
const triggerAvatarUpload = () => {
  avatarInput.value.click();
};

const handleAvatarUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  // Check file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    alert("Kích thước file không được vượt quá 5MB!");
    return;
  }

  // Check file type
  if (!file.type.startsWith("image/")) {
    alert("Vui lòng chọn file ảnh!");
    return;
  }

  try {
    uploadingAvatar.value = true;
    uploadProgress.value = 0;

    // Simulate progress
    const progressInterval = setInterval(() => {
      if (uploadProgress.value < 90) {
        uploadProgress.value += 10;
      }
    }, 100);

    const formData = new FormData();
    formData.append("avatar", file);

    const response = await userService.uploadAvatar(formData);

    clearInterval(progressInterval);
    uploadProgress.value = 100;

    // Update user avatar
    user.value.avatar = response.data.avatar;

    setTimeout(() => {
      uploadingAvatar.value = false;
      uploadProgress.value = 0;
    }, 500);

    alert("Tải lên ảnh đại diện thành công!");
  } catch (error) {
    console.error("Error uploading avatar:", error);
    alert(
      "Có lỗi xảy ra khi tải lên ảnh: " +
        (error.response?.data?.message || error.message)
    );
  } finally {
    // Reset file input
    event.target.value = "";
  }
};

// Delete avatar
const deleteAvatar = async () => {
  if (!confirm("Bạn có chắc chắn muốn xóa ảnh đại diện?")) return;

  try {
    await userService.deleteAvatar();
    user.value.avatar = null;
    alert("Xóa ảnh đại diện thành công!");
  } catch (error) {
    console.error("Error deleting avatar:", error);
    alert(
      "Có lỗi xảy ra khi xóa ảnh: " +
        (error.response?.data?.message || error.message)
    );
  }
};

// Helper functions
const getUserInitials = () => {
  const firstName = user.value.firstName || "";
  const lastName = user.value.lastName || "";
  return `${firstName[0] || ""}${lastName[0] || ""}`.toUpperCase();
};

const formatDate = (dateString) => {
  if (!dateString) return "Chưa cập nhật";
  return new Date(dateString).toLocaleDateString("vi-VN");
};

const getRoleText = (role) => {
  const roleMap = {
    reader: "Độc giả",
    staff: "Nhân viên",
  };
  return roleMap[role] || role;
};

const getRoleClass = (role) => {
  const classMap = {
    reader: "bg-blue-100 text-blue-800 border-blue-200",
    staff: "bg-purple-100 text-purple-800 border-purple-200",
  };
  return classMap[role] || "bg-gray-100 text-gray-800 border-gray-200";
};

const getGenderText = (gender) => {
  const genderMap = {
    male: "Nam",
    female: "Nữ",
    other: "Khác",
  };
  return genderMap[gender] || "Chưa cập nhật";
};

// Modal functions
const closeEditModal = () => {
  showEditModal.value = false;
  // Reset form to current user data
  Object.assign(editForm, {
    firstName: user.value.user.firstName || "",
    lastName: user.value.user.lastName || "",
    email: user.value.user.email || "",
    phone: user.value.user.phone || "",
    gender: user.value.gender || "",
    dateOfBirth: user.value.user.dateOfBirth
      ? user.value.user.dateOfBirth.split("T")[0]
      : "",
    address: user.value.user.address || "",
  });
};

const closePasswordModal = () => {
  showPasswordModal.value = false;
  resetPasswordForm();
};

const resetPasswordForm = () => {
  Object.assign(passwordForm, {
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
};

onMounted(() => {
  fetchUserProfile();
});
</script>
