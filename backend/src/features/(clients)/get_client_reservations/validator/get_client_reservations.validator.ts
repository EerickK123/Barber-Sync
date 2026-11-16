import { Response, Request, NextFunction } from "express";
import { z } from "zod";
import { throwErrorHelper } from "../../../../global/helpers";

export const getClientReservationsValidator = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const schema = z.object({
      status_id: z.string().regex(/^[1-4]$/).optional(),
      page: z.string().regex(/^\d+$/).optional(),
      limit: z.string().regex(/^\d+$/).optional(),
    });

    const result = schema.safeParse(req.query);

    if (!result.success) {
      throwErrorHelper("ERROR.RESERVATIONS.INVALID_QUERY_PARAMS", 400);
    }

    next();
  } catch (error) {
    next(error);
  }
};