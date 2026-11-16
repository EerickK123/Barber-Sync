import { Request, Response, NextFunction } from "express";
import { authService } from "../service/auth.service";
import { authDTO } from "../types/auth.types";
import { createResponseHelper } from "../../../../global/helpers";
import { AppOrigin } from "../../../../global/types/global-types";
export const authController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { email, password }: authDTO = req.body;
    const tokensService = await authService(
      { email, password },
      req.headers["x-app-origin"] as AppOrigin,
      req.headers["user-agent"] ?? "unknown",
    );
    res
      .status(200)
      .json(
        createResponseHelper(
          true,
          { tokens: tokensService },
          "SUCCESS.LOGIN.AUTHENTICATED",
        ),
      );
  } catch (error: any) {
    next(error);
  }
};
