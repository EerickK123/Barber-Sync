import { Response, Request, NextFunction } from "express";
import { createResponseHelper } from "../../../../global/helpers";
import { z } from "zod";

export const joinBarbershopCodeValidator = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const schema = z.object({
    barbershop_code: z.string().regex(/^[A-Z]{3}-[0-9]{3}$/),
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