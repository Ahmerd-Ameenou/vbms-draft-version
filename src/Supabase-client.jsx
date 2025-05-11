import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
"https://appdwlpwpwmvwvziswlf.supabase.co",
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFwcGR3bHB3cHdtdnd2emlzd2xmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY3MTQ0ODUsImV4cCI6MjA2MjI5MDQ4NX0.31u7vHqDn6zl9kiVgG9k29mCI7RsyLAfWvHCHdBZU18" // Supabase API Key
);


