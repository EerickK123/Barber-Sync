import { Request, Response, NextFunction } from "express";
import { registerPushTokenService } from "../service/register_push_token.service";
import { createResponseHelper } from "../../../../global/helpers";

export const registerPushTokenController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { uuid } = req.userPayload!;
    const { token, deviceType } = req.body.pushTokenData;

    await registerPushTokenService(uuid, token, deviceType);

    res
      .status(200)
      .json(createResponseHelper(true, {}, "SUCCESS.TOKEN.REGISTERED"));
  } catch (error: any) {
    next(error);
  }
};