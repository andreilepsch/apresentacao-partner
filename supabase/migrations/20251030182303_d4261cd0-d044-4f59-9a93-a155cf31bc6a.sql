-- Create credit_price table for consortium credit information
CREATE TABLE public.credit_price (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  administradora TEXT NOT NULL,
  group_code INTEGER NOT NULL,
  prazo_months INTEGER NOT NULL,
  credito NUMERIC NOT NULL,
  parcela NUMERIC NOT NULL,
  grupo_descricao TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(administradora, group_code, credito)
);

-- Enable RLS on credit_price
ALTER TABLE public.credit_price ENABLE ROW LEVEL SECURITY;

-- Create index for faster queries
CREATE INDEX idx_credit_price_administradora ON public.credit_price(administradora);
CREATE INDEX idx_credit_price_group_code ON public.credit_price(administradora, group_code);

-- RLS Policies for credit_price
-- All authenticated users can view all credit prices (public data)
CREATE POLICY "Anyone can view credit prices"
  ON public.credit_price
  FOR SELECT
  TO authenticated
  USING (true);

-- Only mentors and admins can insert credit prices
CREATE POLICY "Mentors and admins can insert credit prices"
  ON public.credit_price
  FOR INSERT
  TO authenticated
  WITH CHECK (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'mentor')
  );

-- Only mentors and admins can update credit prices
CREATE POLICY "Mentors and admins can update credit prices"
  ON public.credit_price
  FOR UPDATE
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'mentor')
  )
  WITH CHECK (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'mentor')
  );

-- Only mentors and admins can delete credit prices
CREATE POLICY "Mentors and admins can delete credit prices"
  ON public.credit_price
  FOR DELETE
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'mentor')
  );