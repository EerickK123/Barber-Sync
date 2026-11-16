import { Request, Response, NextFunction } from "express";
import { joinBarbershopByCodeService } from "../service/join_barbershop.service";
import { createResponseHelper } from "../../../../global/helpers";

export const joinBarbershopByCodeController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { uuid } = req.userPayload!;
    const { barbershop_code } = req.body;

    const result = await joinBarbershopByCodeService(uuid, barbershop_code);

    res
      .status(200)
      .json(
        createResponseHelper(
          true,
          { joined: result },
          "SUCCESS.BARBERSHOP.JOINED", 
        ),
      );
  } catch (error: any) {
    next(error);
  }
};