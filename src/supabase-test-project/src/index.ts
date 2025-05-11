import { supabase } from './Supabase-client';

const main = async () => {
  // You can call functions or execute logic here
  await supabase.from('User').select('*');
};

main();