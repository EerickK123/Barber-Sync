import { Response, Request, NextFunction } from "express";
import { createResponseHelper } from "../../../../global/helpers";
import { z } from "zod";
import { DeviceType } from "../types/register_push_token.types";

export const registerPushTokenValidator = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const schema = z.object({
    pushTokenData: {
      push_token: z.string().min(1),
      device_type: z.enum(DeviceType),
    },
  });

  const result = schema.safeParse(req.body);

  if (!result.success) {
    return res
      .status(400)
      .json(createResponseHelper(false, {}, "ERROR.PUSH_TOKEN.INVALID_DATA"));
  }

  next();
};
