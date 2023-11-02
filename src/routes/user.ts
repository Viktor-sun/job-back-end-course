import { Router } from "express";
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
} from "../controllers/user.js";

export const usersRouter = Router();

usersRouter
  .post("/", createUser)
  .get("/", getAllUsers)
  .get("/:userId", getUserById)
  .patch("/:userId", updateUser)
  .delete("/:userId", deleteUser);
