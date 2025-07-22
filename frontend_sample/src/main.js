import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./style.css";

// Create Vue app
const app = createApp(App);

// Use router
app.use(router);

// Mount the app
app.mount("#app");
