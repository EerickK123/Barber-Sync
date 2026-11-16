import { Response, Request, NextFunction } from "express";
import { createResponseHelper } from "../../../../global/helpers";
import { z } from "zod";

const dateOnlyRegex = /^\d{4}-\d{2}-\d{2}$/;

export const getEmployeeAgendaValidator = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const schema = z.object({
    startDate: z.string().regex(dateOnlyRegex).optional(),
    endDate: z.string().regex(dateOnlyRegex).optional(),
    status: z.coerce.number().int().min(1).max(4).optional(),
    page: z.coerce.number().int().min(1).optional(),
    limit: z.coerce.number().int().min(1).optional(),
  });

  const result = schema.safeParse(req.query);

  if (!result.success) {
    return res
      .status(400)
      .json(
        createResponseHelper(false, {}, "ERROR.EMPLOYEE_AGENDA.INVALID_DATA"),
      );
  }

  next();
};