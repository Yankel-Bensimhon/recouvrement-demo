-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL, -- Store hashed passwords only!
    company_name VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create claims table
CREATE TABLE IF NOT EXISTS claims (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE, -- Foreign key to users table
    debtor_name VARCHAR(255) NOT NULL,
    debtor_email VARCHAR(255),
    debtor_address TEXT,
    claim_amount NUMERIC(10, 2) NOT NULL,
    due_date DATE,
    status VARCHAR(50) DEFAULT 'nouveau', -- e.g., nouveau, mise_en_demeure, injonction, solde, perdu
    invoice_reference VARCHAR(255),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create documents table (for storing generated documents metadata)
CREATE TABLE IF NOT EXISTS documents (
    id SERIAL PRIMARY KEY,
    claim_id INTEGER REFERENCES claims(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id), -- Can also be linked to user directly
    document_type VARCHAR(100) NOT NULL, -- e.g., 'mise_en_demeure', 'injonction_de_payer'
    file_path VARCHAR(255), -- Path to the stored PDF, or could be blob data
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    data JSONB -- Store the form data used to generate the document
);

-- Example of adding an index for faster lookups
CREATE INDEX IF NOT EXISTS idx_claims_user_id ON claims(user_id);
CREATE INDEX IF NOT EXISTS idx_claims_status ON claims(status);
CREATE INDEX IF NOT EXISTS idx_documents_claim_id ON documents(claim_id);

-- You might want to add more tables later, e.g., for communications, payment attempts, etc.

-- Function to automatically update 'updated_at' timestamp
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply the trigger to relevant tables
CREATE TRIGGER set_timestamp_users
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_claims
BEFORE UPDATE ON claims
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_documents
BEFORE UPDATE ON documents
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

-- Initial dummy user (for testing purposes, remove or secure properly for production)
INSERT INTO users (id, email, password_hash, company_name)
VALUES (1, 'test@example.com', 'hashed_password_example_not_real', 'Test Company Inc.')
ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email, password_hash = EXCLUDED.password_hash, company_name = EXCLUDED.company_name;

-- Initial dummy claim (for testing purposes, linked to user_id = 1)
INSERT INTO claims (user_id, debtor_name, debtor_email, claim_amount, due_date, status, invoice_reference, description)
VALUES
(1, 'SARL Debiteur Alpha', 'alpha@example.com', 1250.50, '2024-07-15', 'nouveau', 'INV001', 'Facture non réglée pour services de consultation'),
(1, 'Entreprise Beta Services', 'contact@beta.fr', 875.00, '2024-08-01', 'mise_en_demeure', 'INV002', 'Matériel livré non payé'),
(1, 'M. Charles Gamma', 'charles.gamma@email.com', 2300.25, '2024-06-30', 'injonction', 'CONTRAT003', 'Prêt personnel non remboursé')
ON CONFLICT DO NOTHING;

/*
Notes on schema:
- `password_hash`: Never store plain text passwords. Use a strong hashing algorithm like bcrypt or Argon2.
- `user_id` in `claims`: Links a claim to a specific user. Essential for multi-tenancy.
- `status` in `claims`: Tracks the current stage of the debt recovery process.
- `documents` table: Will store metadata about generated PDFs. Storing actual PDFs in the DB (as BYTEA) is possible but often not recommended for large files. Storing a path to a file storage (like S3 or local disk) is more common.
- `JSONB` for `documents.data`: Allows storing the structured data that was used to generate a particular document, which can be useful for audit or regeneration.
- Timestamps: `created_at` and `updated_at` are good practice for tracking changes.
- Indexes: Added for frequently queried columns to improve performance.
*/
