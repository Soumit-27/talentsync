import { Request, Response } from "express";
import { findUserById } from "./auth.service";
import { AuthRequest } from "../middleware/auth.middleware";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import {
  createUser,
  findUserByEmail
} from "./auth.service";

import {
  registerSchema,
  loginSchema
} from "./auth.validation";

export const registerUser = async (
  req: Request,
  res: Response
) => {

  console.log("========== REGISTER REQUEST ==========");
  console.log("Request Body:", req.body);

  try {

    const validatedData =
      registerSchema.parse(req.body);

    console.log("Validated Data:", validatedData);

    const {
      name,
      email,
      password,
      role
    } = validatedData;

    console.log("Name:", name);
    console.log("Email:", email);
    console.log("Role:", role);

    const existingUser =
      await findUserByEmail(email);

    console.log("Existing User:", existingUser);

    if (existingUser) {

      return res.status(400).json({
        success: false,
        message: "User already exists"
      });

    }

    const hashedPassword =
      await bcrypt.hash(password, 12);

    console.log("Password Hashed Successfully");

    const user = await createUser({
      name,
      email,
      password: hashedPassword,
      role
    });

    console.log("User Created:", user);

    res.status(201).json({

      success: true,

      message: "User registered successfully",

      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }

    });

  } catch (error) {

    console.error("========== REGISTER ERROR ==========");
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal server error"
    });

  }
};

export const loginUser = async (
  req: Request,
  res: Response
) => {

  console.log("========== LOGIN REQUEST ==========");
  console.log("Request Body:", req.body);

  try {

    const validatedData =
      loginSchema.parse(req.body);

    console.log("Validated Data:", validatedData);

    const {
      email,
      password
    } = validatedData;

    const user =
      await findUserByEmail(email);

    console.log("User Found:", user);

    if (!user) {

      return res.status(400).json({
        success: false,
        message: "Invalid credentials"
      });

    }

    const isPasswordValid =
      await bcrypt.compare(
        password,
        user.password
      );

    console.log("Password Match:", isPasswordValid);

    if (!isPasswordValid) {

      return res.status(400).json({
        success: false,
        message: "Invalid credentials"
      });

    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "7d"
      }
    );

    console.log("JWT Token Generated");

    res.status(200).json({

      success: true,

      message: "Login successful",

      token,

      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }

    });

  } catch (error) {

    console.error("========== LOGIN ERROR ==========");
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal server error"
    });

  }
};


export const getCurrentUser = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const user = await findUserById(req.user!.id);
    console.log(user, "hgdsfhjsdfhdhfdhfjh")

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};