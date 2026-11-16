import { Response, Request, NextFunction } from "express";
import { createResponseHelper } from "../../../../global/helpers";
import { z } from "zod";

export const cancelEmployeeReservationValidator = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const schema = z.object({
    reservation_id: z.coerce.number().int().positive(),
  });

  const result = schema.safeParse(req.params);

  if (!result.success) {
    return res
      .status(400)
      .json(
        createResponseHelper(false, {}, "ERROR.RESERVATION.INVALID_ID"),
      );
  }

  next();
};