import { Request, Response, NextFunction } from "express";
import { createResponseHelper } from "../../helpers";

interface IErrorResult {
  statusCode: number;
  message: string;
}

type ErrorResolver = (err: any) => IErrorResult | null;

const INTERNAL_ERROR: IErrorResult = {
  statusCode: 500,
  message: "ERROR.INTERNAL_SERVER",
};

const INVALID_REQUEST_ERROR: IErrorResult = {
  statusCode: 400,
  message: "ERROR.REQUEST.INVALID",
};

const INVALID_FILE_ERROR: IErrorResult = {
  statusCode: 400,
  message: "ERROR.MULTER.INVALID_FILE",
};

const SEQUELIZE_ERRORS = new Map<string, IErrorResult>([
  [
    "SequelizeUniqueConstraintError",
    { statusCode: 409, message: "ERROR.DATABASE.DUPLICATE_ENTRY" },
  ],
  [
    "SequelizeValidationError",
    { statusCode: 400, message: "ERROR.DATABASE.VALIDATION_FAILED" },
  ],
  [
    "SequelizeConnectionError",
    { statusCode: 503, message: "ERROR.DATABASE.CONNECTION_LOST" },
  ],
]);

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Si ya se envió una respuesta, Express debe cerrar la conexión (no responder otra vez)
  if (res.headersSent) return next(err);

  const { statusCode, message } = resolveError(err);

  logServerError(req, err, statusCode);

  res.status(statusCode).json(createResponseHelper(false, {}, message));
};

const resolveError = (err: unknown): IErrorResult => {
  const error = toErrorObject(err);

  for (const resolver of ERROR_RESOLVERS) {
    const result = resolver(error);
    if (result) return result;
  }
  return INTERNAL_ERROR;
};

const toErrorObject = (err: unknown): any =>
  typeof err === "object" && err !== null ? err : { message: String(err) };

const logServerError = (req: Request, err: any, statusCode: number): void => {
  if (statusCode < 500) return;
  console.error(`[ERROR] ${req.method} ${req.originalUrl}`, err);
};

const sequelizeErrorHandler: ErrorResolver = (err) =>
  SEQUELIZE_ERRORS.get(err.name) ?? null;

const multerErrorHandler: ErrorResolver = (err) =>
  err.name === "MulterError" ? INVALID_FILE_ERROR : null;

const isAppError = (err: any): boolean =>
  typeof err.message === "string" && err.message.startsWith("ERROR.");

const getAppErrorStatus = (err: any): number =>
  err.status || INTERNAL_ERROR.statusCode;

// Errores propios (throwErrorHelper): su mensaje ya es un código ERROR.*
const appErrorHandler: ErrorResolver = (err) =>
  isAppError(err)
    ? { statusCode: getAppErrorStatus(err), message: err.message }
    : null;

const getHttpStatus = (err: any): number =>
  Number(err.status || err.statusCode);

const isClientErrorStatus = (status: number): boolean =>
  status >= 400 && status < 500;

// Errores de librerías con status 4xx (JSON mal formado, body muy grande, etc.)
const libraryClientErrorHandler: ErrorResolver = (err) =>
  isClientErrorStatus(getHttpStatus(err))
    ? { ...INVALID_REQUEST_ERROR, statusCode: getHttpStatus(err) }
    : null;

// Orden de prioridad: el primero que reconozca el error gana
const ERROR_RESOLVERS: ErrorResolver[] = [
  sequelizeErrorHandler,
  multerErrorHandler,
  appErrorHandler,
  libraryClientErrorHandler,
];
