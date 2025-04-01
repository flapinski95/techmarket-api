const express = require("express");
const {
  getAllBaskets,
  getBasketById,
  addProductToBasket,
  deleteBasket,
  updateBasket,
} = require("../controllers/basketController");

const router = express.Router();

router.get("/", getAllBaskets);
router.get("/:id", getBasketById);
router.post("/", addProductToBasket);
router.put("/:id", updateBasket);
router.delete("/:id", deleteBasket);

module.exports = router;
