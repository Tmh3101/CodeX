import { createRouter, createWebHistory } from "vue-router";
import HomePage from "../views/HomePage.vue";
import BookDetailPage from "../views/BookDetailPage.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: HomePage,
  },
  {
    path: "/books/:id",
    name: "BookDetail",
    component: BookDetailPage,
    props: true,
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
