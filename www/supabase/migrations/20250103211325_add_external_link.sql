-- Add external_link field to posts table
ALTER TABLE posts ADD COLUMN external_link TEXT;

-- Add validation for external_link format
ALTER TABLE posts ADD CONSTRAINT valid_external_link 
  CHECK (
    external_link IS NULL OR 
    external_link ~ '^https?://'
  ); 