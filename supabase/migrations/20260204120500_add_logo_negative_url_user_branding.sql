ALTER TABLE user_branding ADD COLUMN IF NOT EXISTS logo_negative_url text;

-- Update existing records if needed
UPDATE user_branding 
SET logo_negative_url = null 
WHERE logo_negative_url IS NULL;
