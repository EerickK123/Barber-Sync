import { Request, Response, NextFunction } from "express";
import { cancelEmployeeReservationService } from "../service/cancel_reservation.service";
import { createResponseHelper } from "../../../../global/helpers";

export const cancelEmployeeReservationController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { uuid } = req.userPayload!;
    const reservation_id = Number(req.params.reservation_id);

    const result = await cancelEmployeeReservationService(uuid, reservation_id);

    res
      .status(200)
      .json(
        createResponseHelper(
          true,
          { canceled: result },
          "SUCCESS.RESERVATION.CANCELLED",
        ),
      );
  } catch (error: any) {
    next(error);
  }
};
