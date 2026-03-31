import { createClient } from '@supabase/supabase-js';

// Gebruik Vite environment variabelen
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabaseInstance;

// Validatie: Check of URL bestaat en begint met http
if (!supabaseUrl || !supabaseUrl.startsWith('http') || !supabaseAnonKey) {
  console.warn('⚠️ Supabase URL/Key ontbreekt of is ongeldig. De app draait nu in MOCK-modus.');
  
  // Mock object zodat de app niet crasht bij database aanroepen
  supabaseInstance = {
    from: () => ({
      insert: () => Promise.resolve({ data: null, error: null }),
      select: () => ({
        eq: () => ({ data: [], error: null }),
        single: () => Promise.resolve({ data: null, error: null })
      })
    })
  };
} else {
  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
}

export const supabase = supabaseInstance;

// Veilige helper voor het opslaan
export const saveResult = async (resultData: any) => {
  try {
    const { data, error } = await supabase.from('results').insert([resultData]);
    if (error) throw error;
    return { success: true, data };
  } catch (err) {
    console.error('❌ Database save gefaald:', err);
    return { success: false, error: err };
  }
};