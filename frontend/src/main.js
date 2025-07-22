import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import "./style.css";
import "primeicons/primeicons.css";

// Create Vue app
const app = createApp(App);

// Use router
app.use(router);

// Create Pinia instance & Use Pinia
const pinia = createPinia();
app.use(pinia);

// Mount the app
app.mount("#app");
