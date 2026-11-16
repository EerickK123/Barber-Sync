import { Request, Response, NextFunction } from "express";
import { joinEmployeeByPrivateCodeService } from "../service/link_to_barbershop.service";
import { createResponseHelper } from "../../../../global/helpers";

export const joinEmployeeToBarbershopByCodeController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { uuid } = req.userPayload!;
    const { barbershop_private_code } = req.body;

    const joined = await joinEmployeeByPrivateCodeService(
      uuid,
      barbershop_private_code,
    );

    res
      .status(200)
      .json(
        createResponseHelper(
          true,
          { joined },
          "SUCCESS.BARBERSHOP.JOINED",
        ),
      );
  } catch (error: any) {
    next(error);
  }
};