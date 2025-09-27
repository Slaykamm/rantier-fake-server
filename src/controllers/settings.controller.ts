import { Settings } from "../entity/settings.entity";
import { IResponseDto } from "../models/response.model";
import { Request, Response } from "express";
import * as settingsService from "../services/settings.service";
import { ISetSettingsDto } from "../models/settings.model";

export const getSettings = async (
  req: Request,
  res: Response<IResponseDto<Settings>>
) => {
  try {
    const result = await settingsService.getSettingsByUserId(
      req?.user?.email || ""
    );
    if (!!result.success) {
      res.status(200).json({ status: "success", data: result.data });
    } else {
      res.status(400).json({ status: "error", message: result.message });
    }
  } catch {
    res
      .status(500)
      .json({ status: "error", message: `No Users found in database` });
  }
};

export const setSettings = async (
  req: Request<{}, {}, Omit<Settings, "id" | "userId">>,
  res: Response<IResponseDto<Settings>>
) => {
  if (Object.keys(req?.body).length) {
    try {
      const result = await settingsService.setSettings({
        userId: req?.user?.email || "",
        req: req?.body,
      });
      if (!!result.success) {
        res.status(200).json({ status: "success" });
      } else {
        res.status(400).json({ status: "error", message: result.message });
      }
    } catch {
      res
        .status(500)
        .json({ status: "error", message: `No Rents found in database` });
    }
  } else {
    res
      .status(400)
      .json({ status: "error", message: `No Settings to change sent` });
  }
};
