import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://your-supabase-url.supabase.co", 
  "your-anon-public-api-key" // Supabase API Key
);

// Test the connection by fetching data from a table
(async () => {
  const { data, error } = await supabase.from('User').select('*');
  if (error) {
    console.error('Error connecting to Supabase:', error);
  } else {
    console.log('Supabase connection successful. Data:', data);
  }
})();