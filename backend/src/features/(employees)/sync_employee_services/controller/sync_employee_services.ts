import { Request, Response, NextFunction } from "express";
import { syncEmployeeServicesService } from "../service/sync_employee_services.service";
import { createResponseHelper } from "../../../../global/helpers";

export const syncEmployeeServicesController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { uuid } = req.userPayload!;
    const { service_ids } = req.body;

    const result: boolean = await syncEmployeeServicesService(
      uuid,
      service_ids,
    );

    res
      .status(200)
      .json(
        createResponseHelper(
          true,
          { Services_sync: result },
          "SUCCESS.EMPLOYEE_SERVICES.SYNCED",
        ),
      );
  } catch (error: any) {
    next(error);
  }
};
