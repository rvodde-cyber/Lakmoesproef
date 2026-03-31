import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface LakmoesScanResult {
  id?: string;
  sector: string;
  organization_size: string;
  filter_scores: {
    filter_id: string;
    filter_name: string;
    avg_score: number;
  }[];
  overall_score: number;
  created_at?: string;
}

export async function saveResult(result: Omit<LakmoesScanResult, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('lakmoes_results')
    .insert([result])
    .select()
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

export async function getAllResults() {
  const { data, error } = await supabase
    .from('lakmoes_results')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data as LakmoesScanResult[];
}
