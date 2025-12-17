-- Create credit_price table
CREATE TABLE public.credit_price (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  group_code INTEGER NOT NULL,
  prazo_months INTEGER NOT NULL,
  credito NUMERIC NOT NULL,
  parcela NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.credit_price ENABLE ROW LEVEL SECURITY;

-- Create policy for SELECT (anonymous users)
CREATE POLICY "Allow anonymous select on credit_price" 
ON public.credit_price 
FOR SELECT 
USING (true);

-- Create policy for INSERT (service role only)
CREATE POLICY "Allow service role insert on credit_price" 
ON public.credit_price 
FOR INSERT 
WITH CHECK (auth.role() = 'service_role');

-- Create policy for UPDATE (service role only)
CREATE POLICY "Allow service role update on credit_price" 
ON public.credit_price 
FOR UPDATE 
USING (auth.role() = 'service_role');

-- Create policy for DELETE (service role only)
CREATE POLICY "Allow service role delete on credit_price" 
ON public.credit_price 
FOR DELETE 
USING (auth.role() = 'service_role');

-- Insert data for Grupo 6660 — Prazo 182 meses
INSERT INTO public.credit_price (group_code, prazo_months, credito, parcela) VALUES
(6660, 182, 120000, 558.53),
(6660, 182, 130000, 605.07),
(6660, 182, 140000, 651.62),
(6660, 182, 150000, 698.16),
(6660, 182, 160000, 744.70),
(6660, 182, 170000, 791.25),
(6660, 182, 180000, 837.79),
(6660, 182, 190000, 884.34),
(6660, 182, 200000, 930.88),
(6660, 182, 210000, 977.42),
(6660, 182, 220000, 1023.97);

-- Insert data for Grupo 6601 — Prazo 180 meses
INSERT INTO public.credit_price (group_code, prazo_months, credito, parcela) VALUES
(6601, 180, 240000, 1114.08),
(6601, 180, 260000, 1205.92),
(6601, 180, 280000, 1299.76),
(6601, 180, 300000, 1392.60),
(6601, 180, 320000, 1485.44),
(6601, 180, 340000, 1521.86),
(6601, 180, 360000, 1671.12),
(6601, 180, 380000, 1763.96),
(6601, 180, 400000, 1856.80);

-- Insert data for Grupo 6600 — Prazo 160 meses
INSERT INTO public.credit_price (group_code, prazo_months, credito, parcela) VALUES
(6600, 160, 200000, 1019.24),
(6600, 160, 220000, 1121.16),
(6600, 160, 250000, 1274.05),
(6600, 160, 260000, 1325.01),
(6600, 160, 280000, 1426.94),
(6600, 160, 300000, 1521.16),
(6600, 160, 320000, 1630.78),
(6600, 160, 340000, 1732.71),
(6600, 160, 360000, 1834.63),
(6600, 160, 380000, 1936.56),
(6600, 160, 400000, 2038.48);