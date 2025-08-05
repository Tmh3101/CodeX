import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import HomePage from "../views/HomePage.vue";
import LoginPage from "../views/LoginPage.vue";
import RegisterPage from "../views/RegisterPage.vue";
import BookDetailPage from "../views/BookDetailPage.vue";
import ProfilePage from "../views/ProfilePage.vue";
import MyBorrowsPage from "../views/MyBorrowsPage.vue";

// Staff pages
import DashboardPage from "../views/staff/DashboardPage.vue";
import BorrowManagementPage from "../views/staff/BorrowManagementPage.vue";
import BookManagementPage from "../views/staff/BookManagementPage.vue";
import UserManagementPage from "../views/staff/UserManagementPage.vue";
import LibraryInfoManagementPage from "../views/staff/LibraryInfoManagementPage.vue";
import StatisticsPage from "../views/staff/StatisticsPage.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomePage,
      // meta: { requiresGuest: true, requiresAuth: false },
    },
    {
      path: "/login",
      name: "login",
      component: LoginPage,
      meta: { requiresGuest: true },
    },
    {
      path: "/register",
      name: "register",
      component: RegisterPage,
      meta: { requiresGuest: true },
    },
    {
      path: "/books/:id",
      name: "book-detail",
      component: BookDetailPage,
    },
    {
      path: "/profile",
      name: "profile",
      component: ProfilePage,
      meta: { requiresAuth: true },
    },
    {
      path: "/my-borrows",
      name: "my-borrows",
      component: MyBorrowsPage,
      meta: { requiresAuth: true },
    },
    // Staff routes
    {
      path: "/staff/dashboard",
      name: "staff-dashboard",
      component: DashboardPage,
      meta: { requiresAuth: true, requiresStaff: true },
    },
    {
      path: "/staff/borrows",
      name: "staff-borrows",
      component: BorrowManagementPage,
      meta: { requiresAuth: true, requiresStaff: true },
    },
    {
      path: "/staff/books",
      name: "staff-books",
      component: BookManagementPage,
      meta: { requiresAuth: true, requiresStaff: true },
    },
    {
      path: "/staff/users",
      name: "staff-users",
      component: UserManagementPage,
      meta: { requiresAuth: true, requiresStaff: true },
    },
    {
      path: "/staff/library-info",
      name: "staff-library-info",
      component: LibraryInfoManagementPage,
      meta: { requiresAuth: true, requiresStaff: true },
    },
    {
      path: "/staff/statistics",
      name: "staff-statistics",
      component: StatisticsPage,
      meta: { requiresAuth: true, requiresStaff: true },
    },
  ],
});

// Navigation guards
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  // Kiểm tra nếu đây là reload trang
  const isPageReload = !from.name;

  // Initialize auth state và đợi hoàn thành
  if (!authStore.initialized) {
    console.log("Initializing auth store...");
    await authStore.initialize();
  }

  // Nếu có token nhưng chưa load user info thì đợi
  if (authStore.token && !authStore.userInfoLoaded) {
    console.log("Waiting for user info to load...");
    await authStore.fetchUserInfo();
  }

  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const requiresGuest = to.matched.some((record) => record.meta.requiresGuest);
  const requiresStaff = to.matched.some((record) => record.meta.requiresStaff);

  console.log("Router guard:", {
    to: to.path,
    isAuthenticated: authStore.isAuthenticated,
    isStaff: authStore.isStaff,
    userInfoLoaded: authStore.userInfoLoaded,
    canCheckRole: authStore.canCheckRole,
    requiresAuth,
    requiresGuest,
    requiresStaff,
    isPageReload,
  });

  // Xử lý authentication required
  if (requiresAuth && !authStore.isAuthenticated) {
    console.log("Auth required but not authenticated, redirect to login");
    next("/login");
    return;
  }

  // Xử lý guest required (đã đăng nhập nhưng vào trang login/register)
  if (requiresGuest && authStore.isAuthenticated) {
    const redirectPath = authStore.getRedirectPath();
    console.log("Guest required but authenticated, redirect to:", redirectPath);
    next(redirectPath);
    return;
  }

  // Xử lý staff required - chỉ check khi đã có thông tin user
  if (requiresStaff) {
    if (!authStore.canCheckRole) {
      console.log("Cannot check role yet, redirecting to login");
      next("/login");
      return;
    }

    if (!authStore.isStaff) {
      console.log("Staff required but user is not staff, redirect to home");
      next("/");
      return;
    }
  }

  // Logic đặc biệt cho staff khi đã có đầy đủ thông tin
  if (
    authStore.isAuthenticated &&
    authStore.canCheckRole &&
    authStore.isStaff
  ) {
    // Nếu staff đang cố truy cập trang không phải staff
    if (!to.path.startsWith("/staff/")) {
      // Ngoại lệ: cho phép truy cập một số trang cần thiết
      const allowedPaths = ["/profile"];
      if (!allowedPaths.includes(to.path)) {
        console.log("Staff redirected to dashboard from:", to.path);
        next("/staff/dashboard");
        return;
      }
    }
  }

  // Nếu reader cố truy cập trang staff
  if (
    authStore.isAuthenticated &&
    authStore.canCheckRole &&
    authStore.isReader &&
    to.path.startsWith("/staff/")
  ) {
    console.log("Reader trying to access staff area, redirect to home");
    next("/");
    return;
  }

  console.log("Navigation allowed to:", to.path);
  next();
});

export default router;
