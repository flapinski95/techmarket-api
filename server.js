const express = require("express");
const cors = require("cors");
const http = require("http");
const morgan = require("morgan");
require("dotenv").config();
const errorHandler = require("./src/middleware/errorMiddleware");
const productRoutes = require("./src/routes/productRoutes");
const userRoutes = require("./src/routes/userRoutes");
const categoryRoutes = require("./src/routes/categoryRoutes");
const reviewRoutes = require("./src/routes/reviewRoutes");

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use("/api/products", productRoutes);
app.use(errorHandler);
app.use("/api/users", userRoutes);
app.use(errorHandler);
app.use("/api/categories", categoryRoutes);
app.use(errorHandler);
app.use("/api/reviews", reviewRoutes);
app.use(errorHandler);

app.use((req, res) => {
  res.status(404).json({ message: "Nie znaleziono" });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    server.listen(PORT, "0.0.0.0", () =>
      console.log(`Serwer działa na 0.0.0.0:${PORT}`)
    );
  } catch (err) {
    console.error("Błąd startu serwera:", err);
  }
};
if (process.env.NODE_ENV !== "test") {
  startServer();
}
module.exports = app;
