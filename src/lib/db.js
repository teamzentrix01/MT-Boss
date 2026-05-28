// import { Pool } from 'pg';

// const pool = new Pool({
//   host: process.env.DB_HOST,
//   port: parseInt(process.env.DB_PORT || '5432'),
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
// });

// pool.on('error', (err) => {
//   console.error('Unexpected error on idle client', err);
// });

// pool.on('connect', () => {
//   console.log('Connected to PostgreSQL database');
// });

// export default pool;

import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

export default pool;