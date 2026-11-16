import { z } from "zod";
import { Response, Request, NextFunction } from "express";
import { createResponseHelper } from "../../../../global/helpers";

export const authValidator = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const loginSchema = z.object({
    email: z.email(),
    password: z.string().min(6).max(128),
  });

  const result = loginSchema.safeParse(req.body);

  if (!result.success) {
    return res
      .status(400)
      .json(createResponseHelper(false, {}, `ERROR.AUTH.INVALID_DATA`));
  } else {
    next();
  }
};
