require("dotenv").config();

const config = {
  app: {
    port: process.env.PORT || 3000,
  },
  db: {
    uri: process.env.MONGODB_URI || "mongodb://localhost:27017/codex",
  },
  baas: {
    url: process.env.SUPABASE_URL || "https://your-supabase-url.supabase.co",
    serviceRoleKey:
      process.env.SUPABASE_SERVICE_ROLE_KEY || "your-service-role-key",
  },
};

module.exports = config;
