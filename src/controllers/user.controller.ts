import { Request, Response } from "express";
import { IResponseDto } from "../models/response.model";
import { ITransactionsResponseDto } from "../models/transactions.model";
import * as userService from "../services/user.service";
import { IUpdateUserDto } from "../models/user.model";
import { User } from "../entity/user.entity";

export const getOrCreateUserData = async (req: Request, res: Response) => {
  try {
    const userId = req?.user?.email || "";
    if (!userId) {
      return res.status(500).json({
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
      return res.status(500).json({
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
