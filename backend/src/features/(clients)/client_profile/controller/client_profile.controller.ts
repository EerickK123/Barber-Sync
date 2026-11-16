import { Request, Response, NextFunction } from "express";
import { getClientProfileService } from "../service/client_profile.service";
import { createResponseHelper } from "../../../../global/helpers";

export const getClientProfileController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { uuid } = req.userPayload!;

    const profileData = await getClientProfileService(uuid);

    res
      .status(200)
      .json(
        createResponseHelper(
          true,
          { profile: profileData },
          "SUCCESS.CLIENT.PROFILE_RECOVERED",
        ),
      );
  } catch (error: any) {
    next(error);
  }
};
