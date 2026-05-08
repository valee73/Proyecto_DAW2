import { createClient } from "@supabase/supabase-js";

export const supabaseUrl = "https://yzfcxensjsxmivtnmluq.supabase.co";
export const supabaseKey = "sb_publishable_fJtbPxOxjQT9Ty1lNpURXw_Bf-3hcWH";

export const supabase = createClient(supabaseUrl, supabaseKey);
