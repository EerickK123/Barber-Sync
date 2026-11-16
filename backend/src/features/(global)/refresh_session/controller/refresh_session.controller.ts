import { Request, Response, NextFunction } from "express";
import { createResponseHelper } from "../../../../global/helpers";
import { refreshSessionService } from "../service/refresh_session.service";

export const refreshSessionController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { refresh_token } = req.body;
    console.log("refresh token ", refresh_token);
    const device = (req.headers["user-agent"] as string) ?? "unknown";

    const tokens = await refreshSessionService(refresh_token, device);

    res.status(200).json(
      createResponseHelper(true, { tokens }, "SUCCESS.SESSION.REFRESHED"),
    );
  } catch (error: any) {
    next(error);
  }
};