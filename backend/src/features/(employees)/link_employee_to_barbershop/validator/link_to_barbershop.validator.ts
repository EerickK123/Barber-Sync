import { Response, Request, NextFunction } from "express";
import { createResponseHelper } from "../../../../global/helpers";
import { z } from "zod";

export const joinEmployeeToBarbershopbyCodeValidator = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const schema = z.object({
    barbershop_private_code: z
      .string()
      .regex(/^[ABD-Z]-\d{3}-[0-9ABD-Z]{3}-\d[0-9ABD-Z][ABD-Z]-C\d+$/),
  });

  const result = schema.safeParse(req.body);
  
  if (!result.success) {
    return res
      .status(400)
      .json(
        createResponseHelper(false, {}, `ERROR.JOIN_BARBERSHOP.INVALID_DATA`),
      );
  } else {
    next();
  }
};