const express = require("express");
const cors = require("cors");
const http = require("http");
const morgan = require("morgan");
require("dotenv").config();
const errorHandler = require("./src/middleware/errorMiddleware");

const productRoutes = require("./src/routes/productRoutes");

const app = express();
const server = http.createServer(app);
app.use(errorHandler);
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use("/api/products", productRoutes);

app.use((req, res, next) => {
  res.status(404).json({ message: "Nie znaleziono" });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Serwer działa na porcie ${PORT}`));
