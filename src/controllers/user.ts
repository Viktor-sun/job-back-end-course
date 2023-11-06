import { validate } from "class-validator";
import { User } from "../model/postgresql/User.js";
import { AppDataSource } from "../dataSource.js";
import { Request, Response, NextFunction } from "express";

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = new User();
    user.name = req.body.name;
    user.lastName = req.body.lastName;
    user.email = req.body.email;
    user.subscription = req.body.subscription || false;
    user.isAdmin = false;
    user.rating = 0;
    user.createDate = new Date();

    const errors = await validate(user);
    if (errors.length > 0) {
      const result = errors.map((error) => ({
        property: error.property,
        message: error?.constraints?.[Object.keys(error.constraints)[0]],
      }));

      throw new Error(`ERROR: ${JSON.stringify(result)}`);
    }

    const savedUser = await AppDataSource.manager.save(user);
    res.status(201).json(savedUser);
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const savedUsers = await AppDataSource.manager.find(User);

    res.status(200).json(savedUsers);
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await AppDataSource.manager.findOneBy(User, {
      id: Number(req.params.userId),
    });

    if (user) {
      res.status(200).json(user);
    } else {
      throw new Error("User not found");
    }
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await AppDataSource.manager.findOneBy(User, {
      id: Number(req.params.userId),
    });

    if (!user) {
      throw new Error("User not found");
    }

    user.name = req.body.name ?? user.name;
    user.lastName = req.body.lastName ?? user.lastName;
    user.email = req.body.email ?? user.email;
    user.subscription = req.body.subscription ?? user.subscription;
    user.isAdmin = req.body.isAdmin ?? user.isAdmin;
    user.rating = req.body.rating ?? user.rating;

    const errors = await validate(user);
    if (errors.length > 0) {
      const result = errors.map((error) => ({
        property: error.property,
        message: error?.constraints?.[Object.keys(error.constraints)[0]],
      }));

      throw new Error(`ERROR: ${JSON.stringify(result)}`);
    }

    const updatedUser = await AppDataSource.manager.save(user);

    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await AppDataSource.manager.findOneBy(User, {
      id: Number(req.params.userId),
    });

    if (!user) {
      throw new Error("User not found");
    }

    await AppDataSource.manager.remove(user);
    res.status(204).json({});
  } catch (error) {
    next(error);
  }
};
