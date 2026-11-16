import { Response, Request, NextFunction } from "express";
import { z } from "zod";
import { throwErrorHelper } from "../../../../global/helpers";

const datetimeRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/;

export const updateReservationValidator = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const schema = z.object({
      reservation_info: z.object({
        reservation_id:         z.number().int().positive(),
        reservation_barbershop: z.number().int().positive().optional(),
        reservation_datetime:   z.string().regex(datetimeRegex).optional(),
        reservation_employee:   z.string().optional(),
        reservation_service:    z.number().int().positive().optional(),
        reservation_status:     z.number().int().positive().optional(),
      }).refine(
        (val) => val.reservation_id !== undefined && Object.keys(val).length > 1,
        { message: "At least one field to update must be provided" }
      ),
    });

    const result = schema.safeParse(req.body);

    if (!result.success) {
      throwErrorHelper("ERROR.RESERVATION.INVALID_DATA", 400);
    }

    next();
  } catch (error) {
    next(error);
  }
};