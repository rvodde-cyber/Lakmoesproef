// Supabase client initialization
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';

if (!supabaseUrl || !supabaseKey) {
    console.warn('Warning: Supabase URL or Key is not defined. Defaulting to empty strings.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export { supabase };