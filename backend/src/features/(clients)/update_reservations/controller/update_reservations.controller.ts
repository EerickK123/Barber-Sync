import { Request, Response, NextFunction } from "express";
import { updateReservationService } from "../service/update_reservations.service";
import { createResponseHelper } from "../../../../global/helpers";
import { IUpdateReservationData } from "../types/update_reservations.types";

export const updateReservationController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { uuid } = req.userPayload!;
    const data: IUpdateReservationData = req.body.reservation_info;

    const isUpdated = await updateReservationService(uuid, data);

    res.status(200).json(
      createResponseHelper(true, { isUpdated }, "SUCCESS.RESERVATION.UPDATED")
    );
  } catch (error: any) {
    next(error);
  }
};