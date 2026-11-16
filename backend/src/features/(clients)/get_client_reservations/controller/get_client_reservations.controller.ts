import { Request, Response, NextFunction } from "express";
import { createResponseHelper } from "../../../../global/helpers";
import { getClientReservationsService } from "../service/get_client_reservations.service";

export const getClientReservationsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { uuid } = req.userPayload!;
    const { status_id, page, limit } = req.query;

    const parsedStatusId = status_id ? parseInt(status_id as string, 10) : undefined;
    const parsedPage = page ? parseInt(page as string, 10) : 1;
    const parsedLimit = limit ? parseInt(limit as string, 10) : 20;

    const result = await getClientReservationsService(
      uuid,
      parsedStatusId,
      parsedPage,
      parsedLimit
    );

    res.status(200).json(
      createResponseHelper(
        true,
        result,
        "SUCCESS.RESERVATIONS.RECOVERED",
      ),
    );
  } catch (error: any) {
    next(error);
  }
};