const { createClient } = require("@supabase/supabase-js");
const config = require("../config");

// This file is used to create a Supabase client instance.
const supabase = createClient(config.baas.url, config.baas.serviceRoleKey);

module.exports = supabase;
