import { Request, Response, NextFunction } from "express";
import { createResponseHelper } from "../../../../global/helpers";
import { createReservationService } from "../service/create_reservation.service";

export const createReservationController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { uuid } = req.userPayload!;
    const data = req.body.reservation_info;
    const reservation = await createReservationService(data, uuid);

    res.status(200).json(
      createResponseHelper(
        true,
        {
          isCreated: reservation,
        },
        "SUCCESS.RESERVATION.CREATED",
      ),
    );
  } catch (error: any) {
    next(error);
  }
};

