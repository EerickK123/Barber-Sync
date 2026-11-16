import { Request, Response, NextFunction } from "express";
import { updateClientProfileService } from "../service/update_client_profile.service";
import { createResponseHelper } from "../../../../global/helpers";
import { IUpdateClientProfileData } from "../types/update_client_profile.types";

export const updateClientProfileController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { uuid } = req.userPayload!;
    const file = req.file;

    const rawData =
      typeof req.body.data === "string"
        ? JSON.parse(req.body.data)
        : req.body.data;

    const profileData = rawData?.["update-profile"] as IUpdateClientProfileData;

    const isUpdated = await updateClientProfileService(uuid, profileData, file);

    res.status(200).json(
      createResponseHelper(true, { updated: isUpdated }, "SUCCESS.CLIENT.PROFILE_UPDATED")
    );
  } catch (error: any) {
    next(error);
  }
};