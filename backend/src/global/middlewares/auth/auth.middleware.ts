import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { createResponseHelper, throwErrorHelper } from "../../helpers";
import { tokenPayload } from "../../types/global-types";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const rawToken = getToken(req) as string;
    verifyTokenSyntax(rawToken);
    const secretKey = validateSecretKey();
    const decodedToken = jwt.verify(rawToken, secretKey!);
    validateDecodedToken(decodedToken);
    const currentTime = Math.floor(Date.now() / 1000);
    const payload = decodedToken as tokenPayload;

    if (payload.exp && payload.exp < currentTime) {
      throwErrorHelper("ERROR.AUTH.TOKEN_EXPIRED", 401);
    }

    req.userPayload = {
      uuid: payload.uuid,
      user_role: payload.user_role,
      user_name: payload.user_name,
      user_lastname: payload.user_lastname,
    };

    next();
  } catch (error: any) {
    const statusCode = error.status || 401;
    const jwtErrorMap: Record<string, string> = {
      TokenExpiredError: "ERROR.AUTH.TOKEN_EXPIRED",
      JsonWebTokenError: "ERROR.AUTH.INVALID_TOKEN",
    };
    const errorMessage = jwtErrorMap[error.name] || error.message;
    return res
      .status(statusCode)
      .json(createResponseHelper(false, {}, errorMessage));
  }
};

const getToken = (req: Request) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throwErrorHelper("ERROR.AUTH.MISSING_TOKEN", 401);
  }
  return authHeader?.split(" ")[1];
};

const verifyTokenSyntax = (token: string) => {
  const tokenRegex = /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/;

  if (token.length < 10 || token.length > 512 || !tokenRegex.test(token)) {
    throwErrorHelper("ERROR.AUTH.INVALID_TOKEN_FORMAT", 400);
  }
};

const validateSecretKey = () => {
  const secretKey = process.env.JWT_SECRET;
  if (!secretKey) {
    throwErrorHelper("ERROR.AUTH.MISSING_JWT_SECRET_KEY", 500);
  }
  return secretKey;
};

const validateDecodedToken = (decoded: any) => {
  if (typeof decoded !== "object" || decoded === null || !decoded.uuid) {
    throwErrorHelper("ERROR.AUTH.INVALID_TOKEN", 401);
  }
};
