import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("../views/HomePage.vue"),
  },
  {
    path: "/books/:id",
    name: "BookDetail",
    component: () => import("../views/BookDetailPage.vue"),
    props: true,
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/LoginPage.vue"),
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("../views/RegisterPage.vue"),
  },
  {
    path: "/borrows",
    name: "MyBorrows",
    // Lazy-loaded component
    component: () => import("../views/MyBorrowsPage.vue"),
  },
  {
    path: "/profile",
    name: "Profile",
    // Lazy-loaded component
    component: () => import("../views/ProfilePage.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    // Always scroll to top when navigating
    return { top: 0 };
  },
});

export default router;
