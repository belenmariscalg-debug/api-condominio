require('dotenv').config();
const { Pool, types } = require('pg');

// Devuelve las columnas DATE como texto "YYYY-MM-DD" (sin hora)
types.setTypeParser(1082, (valor) => valor);

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'Condominio_Residencial',
  password: 'class',
  port: 5432,
});

module.exports = pool;
