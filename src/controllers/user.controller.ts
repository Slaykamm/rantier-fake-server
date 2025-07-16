import { Request, Response } from "express";
import { IResponseDto } from "../models/response.model";
import { ITransactionsResponseDto } from "../models/transactions.model";
import * as userService from "../services/user.service";
import { IUpdateUserDto } from "../models/user.model";
import { User } from "../entity/user.entity";
import path from "path";

export const getOrCreateUserData = async (req: Request, res: Response) => {
  try {
    const userId = req?.user?.email || "";
    if (!userId) {
      return res.status(401).json({
        status: "error",
        message: `No token provided`,
      });
    }
    const respData = await userService.createUserByUserId(userId);

    if (!!respData.success) {
      res.status(200).json({
        status: "success",
        data: [respData.data],
      });
    } else {
      res.status(500).json({
        status: "error",
        message: `Something went wrong with userCreation`,
      });
    }
  } catch (e) {
    res.status(500).json({
      status: "error",
      message: `Something went wrong with userCreation ${e}`,
    });
  }
};

export const updateUserData = async (
  req: Request<{}, {}, IUpdateUserDto>,
  res: Response<IResponseDto<User>>
) => {
  try {
    const userId = req?.user?.email || "";
    if (!userId) {
      return res.status(401).json({
        status: "error",
        message: `No token provided`,
      });
    }
    const respData = await userService.updateUserDataAction({
      ...req.body,
      userId,
    });

    if (!!respData.success) {
      res.status(200).json({
        status: "success",
        // data: [respData.data],
      });
    } else {
      res.status(400).json({
        status: "error",
        message: `Something went wrong with userCreation`,
      });
    }
  } catch (e) {
    res.status(500).json({
      status: "error",
      message: `Something went wrong with userCreation ${e}`,
    });
  }
};

export const getUserAvatar = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.email || "";
    if (!userId) {
      return res.status(401).json({
        status: "error",
        message: "No token provided",
      });
    }

    const user = await userService.getUserByUserId(userId);
    if (!user || !user.avatar) {
      return res.status(404).json({
        status: "error",
        message: "Avatar not found",
      });
    }

    res.sendFile(path.resolve(user.avatar));
  } catch (e) {
    res.status(500).json({
      status: "error",
      message: `Server error: ${e}`,
    });
  }
};

export const updateUserAvatar = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.email || "";
    if (!userId) {
      return res.status(401).json({
        status: "error",
        message: "No token provided",
      });
    }
    console.log("test111", req.body);
    if (!req.file) {
      return res.status(400).json({
        status: "error",
        message: "No file uploaded",
      });
    }

    const result = await userService.updateUserAvatar(userId, req.file.path);
    const respData = await userService.updateUserDataAction({
      ...req.body,
      userId,
    });

    if (result.success) {
      res.status(200).json({
        status: "success",
        data: {
          avatarUrl: `/uploads/${path.basename(req.file.path)}`,
        },
      });
    } else {
      res.status(400).json({
        status: "error",
        message: result.message || "Avatar update failed",
      });
    }
  } catch (e) {
    res.status(500).json({
      status: "error",
      message: `Server error: ${e}`,
    });
  }
};
