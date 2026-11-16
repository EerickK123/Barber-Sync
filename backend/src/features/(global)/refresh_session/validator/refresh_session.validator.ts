import { z } from "zod";
import { Request, Response, NextFunction } from "express";
import { throwErrorHelper } from "../../../../global/helpers";

export const refreshSessionValidator = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const schema = z.object({
      refresh_token: z.string().min(1),
    });

    const result = schema.safeParse(req.body);

    if (!result.success) {
      throwErrorHelper("ERROR.REFRESH.INVALID_DATA", 400);
    }

    next();
  } catch (error) {
    next(error);
  }
};