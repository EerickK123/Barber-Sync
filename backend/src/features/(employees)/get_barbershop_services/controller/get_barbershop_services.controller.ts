import { Request, Response, NextFunction } from "express";
import { createResponseHelper } from "../../../../global/helpers";
import { getBarbershopServicesListService } from "../service/get_barbershop_services.service";

export const getBarbershopServicesController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { uuid } = req.userPayload!;
    const result = await getBarbershopServicesListService(uuid);
    res
      .status(200)
      .json(
        createResponseHelper(
          true,
          { barbershop_services: result },
          "SUCCESS.RESERVATIONS.RECOVERED",
        ),
      );
  } catch (error: any) {
    next(error);
  }
};
