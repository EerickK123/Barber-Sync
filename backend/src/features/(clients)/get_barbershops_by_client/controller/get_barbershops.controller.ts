import { Request, Response, NextFunction } from "express";
import { getBarbershopsService } from "../service/get_barbershops.service";
import { createResponseHelper } from "../../../../global/helpers";

export const getBarbershopsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { uuid } = req.userPayload!;
    const barbershops = await getBarbershopsService(uuid);
    res
      .status(200)
      .json(
        createResponseHelper(
          true,
          { barbershops: barbershops },
          "SUCCESS.BARBERSHOPS.RECOVERED",
        ),
      );
  } catch (error: any) {
    next(error);
  }
};