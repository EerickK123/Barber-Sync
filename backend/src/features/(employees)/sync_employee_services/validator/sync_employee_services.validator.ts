import { Response, Request, NextFunction } from "express";
import { createResponseHelper } from "../../../../global/helpers";
import { z } from "zod";

export const syncEmployeeServicesValidator = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const schema = z.object({
    service_ids: z.array(z.number().positive()).min(1),
  });

  const result = schema.safeParse(req.body);

  if (!result.success) {
    return res
      .status(400)
      .json(
        createResponseHelper(false, {}, `ERROR.SYNC_SERVICES.INVALID_DATA`),
      );
  } else {
    next();
  }
};
