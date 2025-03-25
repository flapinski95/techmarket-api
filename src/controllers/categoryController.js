const Category = require("../models/Category");

const getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.getAllCategories();
    res.json(categories);
  } catch (err) {
    next(err);
  }
};
const getCategoryById = async (req, res, next) => {
  try {
    const category = await Category.getCategoryById(req.params.id);
    if (!category)
      return res.status(404).json({ message: "Kategoria nie znaleziona" });
    res.json(category);
  } catch (err) {
    next(err);
  }
};
const addCategory = async (req, res, next) => {
  try {
    const newCategory = await Category.createCategory(req.body);
    res.status(201).json(newCategory);
  } catch (err) {
    next(err);
  }
};
const updateCategory = async (req, res, next) => {
  try {
    const updatedCategory = await Category.updateCategory(
      req.params.id,
      req.body
    );
    if (!updatedCategory)
      return res.status(404).json({ message: "Kategoria nie znaleziona" });
    res.json(updatedCategory);
  } catch (err) {
    next(err);
  }
};
const deleteCategory = async (req, res, next) => {
  try {
    await Category.deleteCategory(req.params.id);
    res.status(204).json({ message: "Kategoria usunięta" });
  } catch (err) {
    next(err);
  }
};
module.exports = {
  getAllCategories,
  getCategoryById,
  addCategory,
  updateCategory,
  deleteCategory,
};
