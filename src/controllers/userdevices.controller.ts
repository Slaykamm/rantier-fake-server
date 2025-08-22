import { Settings } from "../entity/settings.entity";
import { IResponseDto } from "../models/response.model";
import { Request, Response } from "express";
import * as userDevices from "../services/userDevices.service";
import { IUserDeviceUpdateDto } from "../models/userDevices.model";
import { UserDevices } from "../entity/userDevices.entity";

export const updateUserDevice = async (
  req: Request<{}, {}, IUserDeviceUpdateDto>,
  res: Response<IResponseDto<UserDevices>>
) => {
  if (Object.keys(req?.body).length) {
    try {
      const result = await userDevices.updateUserDevice({
        userId: req?.user?.email || "",
        req: req?.body,
      });
      if (!!result.success) {
        res.status(200).json({
          status: "success",
          data: result.data,
          message: result.message,
        });
      } else {
        res.status(400).json({ status: "error", message: result.message });
      }
    } catch {
      res
        .status(500)
        .json({ status: "error", message: `Something went wrong` });
    }
  } else {
    res
      .status(400)
      .json({ status: "error", message: `No User devices sent to update` });
  }
};
