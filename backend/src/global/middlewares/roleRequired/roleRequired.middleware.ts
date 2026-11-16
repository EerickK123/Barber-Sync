import { Response, Request, NextFunction } from "express";
import { createResponseHelper, throwErrorHelper } from "../../helpers";
import {UserRole} from "../../types/global-types";

export const roleRequiredMiddleware =
  (roleLevelRequired: UserRole) =>
  (req: Request, res: Response, next: NextFunction) => {
    roleRequired(req, res, next, roleLevelRequired);
  };

const roleRequired = (
  req: Request,
  res: Response,
  next: NextFunction,
  roleLevelRequired: UserRole,
) => {
  try {
    const userRole = validateUser(req);
    validateRole(next, roleLevelRequired, userRole as UserRole);
  } catch (error: any) {
    return res
      .status(error.status)
      .json(createResponseHelper(false, {}, error.message));
  }
};

const validateUser = (req: Request) => {
  const user = req.userPayload;
  if (!user) {
    throwErrorHelper("ERROR.AUTH.MISSING_USER", 401);
  }
  return user?.user_role as UserRole;
};

const validateRole = (
  next: NextFunction,
  roleRequired: UserRole,
  userRole: UserRole,
) => {
  if (userRole == roleRequired) {
    next();
  } else {
    throwErrorHelper("ERROR.AUTH.ROLE_NOT_AUTHORIZED", 403);
  }
};
