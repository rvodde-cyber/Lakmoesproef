/*
  # Create lakmoes_scans table for Moral Litmus Test app

  1. New Tables
    - `lakmoes_scans`
      - `id` (uuid, primary key) - Unique identifier for each scan
      - `created_at` (timestamptz) - When the scan was completed
      - `sector` (text) - Organization sector
      - `organisatie_omvang` (text) - Organization size (FTE)
      - `totaal_score` (integer) - Total score percentage (0-100)
      - `morele_zuurgraad` (text) - Moral pH zone (Zuur, Licht Zuur, Neutraal, Basisch)
      - `f1` through `f12` (numeric) - Individual filter scores (1-5)

  2. Security
    - Enable RLS on `lakmoes_scans` table
    - Add policy for public INSERT (anyone can submit a scan anonymously)
    - Add policy for authenticated users to read all scans
*/

CREATE TABLE IF NOT EXISTS lakmoes_scans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  sector text NOT NULL,
  organisatie_omvang text NOT NULL,
  totaal_score integer NOT NULL,
  morele_zuurgraad text NOT NULL,
  f1 numeric NOT NULL,
  f2 numeric NOT NULL,
  f3 numeric NOT NULL,
  f4 numeric NOT NULL,
  f5 numeric NOT NULL,
  f6 numeric NOT NULL,
  f7 numeric NOT NULL,
  f8 numeric NOT NULL,
  f9 numeric NOT NULL,
  f10 numeric NOT NULL,
  f11 numeric NOT NULL,
  f12 numeric NOT NULL
);

ALTER TABLE lakmoes_scans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a scan"
  ON lakmoes_scans
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Authenticated users can read all scans"
  ON lakmoes_scans
  FOR SELECT
  TO authenticated
  USING (true);
