/*
  # Create lakmoes_results table

  1. New Tables
    - `lakmoes_results`
      - `id` (uuid, primary key) - Uniek ID per inzending
      - `sector` (text) - De gekozen sector
      - `organization_size` (text) - De gekozen organisatiegrootte
      - `filter_scores` (jsonb) - Gemiddelde scores van alle 12 filters
      - `overall_score` (numeric) - Overall percentage score
      - `created_at` (timestamptz) - Datum/tijd van inzending
  
  2. Security
    - Enable RLS on `lakmoes_results` table
    - Add policy for anonymous users to insert their own results
    - Add policy for authenticated admin users to view all results
*/

CREATE TABLE IF NOT EXISTS lakmoes_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sector text NOT NULL,
  organization_size text NOT NULL,
  filter_scores jsonb NOT NULL,
  overall_score numeric NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE lakmoes_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert results"
  ON lakmoes_results
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view all results"
  ON lakmoes_results
  FOR SELECT
  TO authenticated
  USING (true);