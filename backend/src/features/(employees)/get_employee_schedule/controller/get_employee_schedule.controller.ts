import { Request, Response, NextFunction } from "express";
import { getEmployeeAgendaService } from "../service/get_employee_schedule.service";
import { createResponseHelper } from "../../../../global/helpers";

export const getEmployeeAgendaController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { uuid } = req.userPayload!;
    const { startDate, endDate, status, page, limit } = req.query;

    const result = await getEmployeeAgendaService(uuid, {
      startDate: startDate as string | undefined,
      endDate: endDate as string | undefined,
      status: status ? Number(status) : undefined,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });

    res
      .status(200)
      .json(
        createResponseHelper(true, result, "SUCCESS.EMPLOYEE_AGENDA.FETCHED"),
      );
  } catch (error: any) {
    next(error);
  }
};
