-- Remove old service_role policies
DROP POLICY IF EXISTS "Allow service role insert on credit_price" ON credit_price;
DROP POLICY IF EXISTS "Allow service role update on credit_price" ON credit_price;
DROP POLICY IF EXISTS "Allow service role delete on credit_price" ON credit_price;

-- Create new policies for authenticated users
CREATE POLICY "Authenticated users can insert credit prices"
ON credit_price
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update credit prices"
ON credit_price
FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete credit prices"
ON credit_price
FOR DELETE
TO authenticated
USING (true);