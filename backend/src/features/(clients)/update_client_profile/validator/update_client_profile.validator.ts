import { Response, Request, NextFunction } from "express";
import { z } from "zod";
import { createResponseHelper } from "../../../../global/helpers";

export const updateClientProfileValidator = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const rawData =
      typeof req.body.data === "string"
        ? JSON.parse(req.body.data)
        : req.body.data;

    const schema = z.object({
      profile_info: z
        .object({
          name: z.string().min(2),
          lastName: z.string().min(2),
          phone: z.string().min(7).max(20),
          email: z.email(),
          currentPassword: z.string().min(6).optional(),
          newPassword: z.string().min(6).optional(),
        })
        .refine(
          (data) => {
            if (
              (data.currentPassword && !data.newPassword) ||
              (!data.currentPassword && data.newPassword)
            ) {
              return false;
            }
            return true;
          },
          {
            message: "ERROR.CLIENT.BOTH_PASSWORDS_REQUIRED",
            path: ["newPassword"],
          },
        ),
    });

    const result = schema.safeParse(rawData?.["update-profile"]);

    if (!result.success) {
      return res
        .status(400)
        .json(
          createResponseHelper(false, {}, "ERROR.CLIENT.INVALID_UPDATE_DATA"),
        );
    } else {
      next();
    }
  } catch (error) {
    return res
      .status(400)
      .json(
        createResponseHelper(false, {}, "ERROR.CLIENT.INVALID_JSON_FORMAT"),
      );
  }
};