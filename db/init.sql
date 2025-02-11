-- Connect to the database
\c kyc_database;

-- Enable the UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create a Super Admin user (One-time setup)
-- IMPORTANT: Replace with a secure password and a real email!
INSERT INTO users (id, name, age, filesource, email, password, role, "assignedRole")
VALUES (uuid_generate_v4(), 'Super Admin', 30, '', 'superadmin@example.com', 'superadmin', 'SUPER', 'SUPER');
