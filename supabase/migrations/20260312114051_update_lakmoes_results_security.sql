/*
  # Update lakmoes_results security policies

  1. Security Changes
    - Remove the policy that allows authenticated users to view all results
    - Keep the policy that allows anyone to insert results (for anonymous student submissions)
    - This ensures that data can be written by students but cannot be read by unauthorized users
    - Admin access will be handled through application-level authentication in the frontend
  
  2. Notes
    - Students can submit their results anonymously
    - Only authorized admin users (with proper authentication) can view results
    - This prevents unauthorized access to collected data
*/

DROP POLICY IF EXISTS "Authenticated users can view all results" ON lakmoes_results;

CREATE POLICY "Only service role can view results"
  ON lakmoes_results
  FOR SELECT
  TO authenticated
  USING (
    (SELECT auth.jwt() ->> 'role') = 'service_role'
    OR
    (SELECT auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true
  );