import { Request, Response, NextFunction } from "express";
import { getAllBarbershopInfoService } from "../service/barbershop_profile.service";
import { createResponseHelper } from "../../../../global/helpers";

export const getAllBarbershopInfoController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { barbershop_code } = req.body;
    const { uuid } = req.userPayload!;
    const barbershopData = await getAllBarbershopInfoService(
      barbershop_code as string,
      uuid,
    );
    res
      .status(200)
      .json(
        createResponseHelper(
          true,
          { data: barbershopData },
          "SUCCESS.BARBERSHOPS.PROFILE_RECOVERED",
        ),
      );
  } catch (error: any) {
    next(error);
  }
};
