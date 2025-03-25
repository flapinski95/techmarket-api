const prisma = require("./prismaClient");

prisma
  .$connect()
  .then(() => {
    console.log("Połączono z PostgreSQL za pomocą Prisma");
  })
  .catch((err) => {
    console.error("Błąd połączenia z PostgreSQL za pomocą Prisma:", err);
  });

module.exports = prisma;
