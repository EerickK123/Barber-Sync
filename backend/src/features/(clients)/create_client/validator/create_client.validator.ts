import { Response, Request, NextFunction } from "express";
import { createResponseHelper } from "../../../../global/helpers";
import { createUserSchema } from "../../../(global)/create_user";
import { v2 as cloudinary } from "cloudinary";

export const createClientValidator = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const rawData =
      typeof req.body.data === "string"
        ? JSON.parse(req.body.data)
        : req.body.data || req.body;

    const clientData = rawData?.create_client_data || rawData;

    const result = createUserSchema.safeParse(clientData);

    if (!result.success) {
      if (req.file && req.file.filename) {
        await cloudinary.uploader.destroy(req.file.filename);
      }
      return res
        .status(400)
        .json(
          createResponseHelper(false, {}, `ERROR.CREATE_CLIENT.INVALID_DATA`),
        );
    }

    next();
  } catch (error) {
    if (req.file && req.file.filename) {
      try {
        await cloudinary.uploader.destroy(req.file.filename);
      } catch (cloudinaryError) {
        console.error(
          "Error al borrar en catch del validador:",
          cloudinaryError,
        );
      }
    }
    next(error);
  }
};
