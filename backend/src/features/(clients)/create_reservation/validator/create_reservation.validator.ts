import { Response, Request, NextFunction } from "express";
import { z } from "zod";
import { createResponseHelper } from "../../../../global/helpers";

const datetimeRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/;

export const createReservationValidator = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const schema = z.object({
    reservation_info: z.object({
      reservation_barbershop: z.number().int().positive(),
      reservation_service: z.number().int().positive(),
      reservation_employee: z.string(),// cambiar a uuid   
      reservation_datetime: z.string().regex(datetimeRegex),
    }),
  });
  const result = schema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json(
      createResponseHelper(
        false,
        {
          error: result.error,
        },
        "ERROR.RESERVATION.INVALID_DATA",
      ),
    );
  }

  next();
};