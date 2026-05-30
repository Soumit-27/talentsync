import { Request, Response } from "express";

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

  try {

    const validatedData =
      registerSchema.parse(req.body);

    const {
      name,
      email,
      password,
      role
    } = validatedData;

    const existingUser =
      await findUserByEmail(email);

    if (existingUser) {

      return res.status(400).json({
        success: false,
        message: "User already exists"
      });

    }

    const hashedPassword =
      await bcrypt.hash(password, 12);

    const user = await createUser({
      name,
      email,
      password: hashedPassword,
      role
    });

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

  try {

    const validatedData =
      loginSchema.parse(req.body);

    const {
      email,
      password
    } = validatedData;

    const user =
      await findUserByEmail(email);

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

    res.status(500).json({
      success: false,
      message: "Internal server error"
    });

  }
};