const { createClient } = require("@supabase/supabase-js");
const config = require("../config");

const supabase = createClient(config.baas.url, config.baas.serviceRoleKey);

module.exports = supabase;
