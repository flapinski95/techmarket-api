const mongoose = require("mongoose");

const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    if (process.env.NODE_ENV !== "test") {
      console.log("Połączono z MongoDB");
    }
  } catch (error) {
    console.error("Błąd połączenia z MongoDB", error);
    process.exit(1);
  }
};

module.exports = connectMongoDB;
