import { createResponseHelper } from "../../helpers";
import { NextFunction, Request, Response } from "express";
import { AppOrigin } from "../../types/global-types";

export const appOriginMiddleware =
  (allowedOrigins: AppOrigin | AppOrigin[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    const requestOrigin = req.headers["x-app-origin"] as AppOrigin;

    const origins = Array.isArray(allowedOrigins)
      ? allowedOrigins
      : [allowedOrigins];

    if (!isOriginAllowed(requestOrigin, origins)) {
      return res
        .status(403)
        .json(createResponseHelper(false, {}, "ERROR.ORIGIN.FORBIDDEN"));
    }

    req.appContext = requestOrigin;

    next();
  };

const isOriginAllowed = (requestOrigin: AppOrigin, origins: AppOrigin[]) =>
  Boolean(requestOrigin) && origins.includes(requestOrigin);