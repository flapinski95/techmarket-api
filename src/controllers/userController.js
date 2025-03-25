const User = require("../models/User");

const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.getAllUsers();
    res.json(users);
  } catch (err) {
    next(err);
  }
};
const getUserById = async (req, res, next) => {
  try {
    const user = await User.getUserById(req.params.id);
    if (!user)
      return res.status(404).json({ message: "Użytkownik nie znaleziony" });
    res.json(user);
  } catch (err) {
    next(err);
  }
};
const addUser = async (req, res, next) => {
  try {
    const newUser = await User.createUser(req.body);
    res.status(201).json(newUser);
  } catch (err) {
    next(err);
  }
};
const updateUser = async (req, res, next) => {
  try {
    const updatedUser = await User.updateUser(req.params.id, req.body);
    if (!updatedUser)
      return res.status(404).json({ message: "Użytkownik nie znaleziony" });
    res.json(updatedUser);
  } catch (err) {
    next(err);
  }
};
const deleteUser = async (req, res, next) => {
  try {
    await User.deleteUser(req.params.id);
    res.status(204).json({ message: "Użytkownik usunięty" });
  } catch (err) {
    next(err);
  }
};
module.exports = {
  getAllUsers,
  getUserById,
  addUser,
  updateUser,
  deleteUser,
};
