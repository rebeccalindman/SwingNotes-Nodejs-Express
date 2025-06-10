import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

/* const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: Number(process.env.PGPORT),
}); */

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // neon requires ssl connection but no strict verification
  },
});

export default pool;