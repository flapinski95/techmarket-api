const pool = require("./db");

const initDb = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      category VARCHAR(255) NOT NULL,
      description TEXT,
      price DECIMAL(10, 2) NOT NULL,
      stock_count INTEGER NOT NULL,
      brand VARCHAR(255),
      image_url VARCHAR(255),
      is_available BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await pool.query(query);
    console.log("Tabela products gotowa!");
  } catch (err) {
    console.error("Błąd podczas inicjalizacji tabeli:", err);
    process.exit(1);
  }
};

module.exports = initDb;
