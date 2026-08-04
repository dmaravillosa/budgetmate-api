import knex from 'knex';

const connection = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'budgetmate',
};

const db = knex({
  client: 'mysql2',
  connection,
  pool: {
    min: 2,
    max: 10,
  },
  acquireConnectionTimeout: 10000,
});

export default db;
