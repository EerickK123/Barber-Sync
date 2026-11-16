import { Request, Response, NextFunction } from "express";
import { OnboardingStatusService } from "../service/onboarding_status.model";
import { createResponseHelper } from "../../../../global/helpers";

export const OnboardingStatusController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { uuid } = req.userPayload!;

    const status = await OnboardingStatusService(uuid);

    res
      .status(200)
      .json(
        createResponseHelper(
          true,
          status ,
          "SUCCESS.EMPLOYEE.STATUS_RETRIEVED",
        ),
      );
  } catch (error: any) {
    next(error);
  }
};
