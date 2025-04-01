const Basket = require("../models/Basket");

const getAllBaskets = async (req, res, next) => {
  try {
    const baskets = await Basket.getAllBaskets();
    res.json(baskets);
  } catch (err) {
    next(err);
  }
};
const getBasketById = async (req, res, next) => {
  try {
    const basket = await Basket.getBasketById(req.params.id);
    if (!basket)
      return res.status(404).json({ message: "Koszyk nie znaleziony" });
    res.json(basket);
  } catch (err) {
    next(err);
  }
};

const addProductToBasket = async (req, res, next) => {
  try {
    const newProduct = await Basket.addProductToBasket(req.body);
    res.status(201).json(newProduct);
  } catch (err) {
    next(err);
  }
};
const deleteBasket = async (req, res, next) => {
  try {
    await Basket.deleteBasket(req.params.id);
    res.status(204).json({ message: "Koszyk usunięty" });
  } catch (err) {
    next(err);
  }
};
const updateBasket = async (req, res, next) => {
  try {
    const updatedBasket = await Basket.updateBasket(req.params.id, req.body);
    if (!updatedBasket)
      return res.status(404).json({ message: "Koszyk nie znaleziony" });
    res.json(updatedBasket);
  } catch (err) {
    next(err);
  }
};
module.exports = {
  getAllBaskets,
  getBasketById,
  addProductToBasket,
  deleteBasket,
  updateBasket,
};
