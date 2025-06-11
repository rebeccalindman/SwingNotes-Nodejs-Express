## Run the following in the query tool or SQL editor depending on db environment:


``` CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
username VARCHAR(100),
email VARCHAR(100),
created_at TIMESTAMPTZ DEFAULT now(),
updated_at TIMESTAMPTZ,
hashedpassword TEXT,
role VARCHAR(25) DEFAULT 'user'
)


CREATE TABLE IF NOT EXISTS notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    text TEXT NOT NULL,
    category VARCHAR(25),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER set_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();


CREATE TRIGGER set_updated_at_on_notes
BEFORE UPDATE ON notes
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
```