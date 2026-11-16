import { Request, Response, NextFunction } from "express";
import { createEmployeeService } from "../service/create_employee.service";
import { createResponseHelper } from "../../../../global/helpers";
import { AppOrigin } from "../../../../global/types/global-types";
import { v2 as cloudinary } from "cloudinary";

export const createEmployeeController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const file = req.file;
    const origin = req.headers["x-app-origin"] as AppOrigin;
    const device = req.headers["user-agent"] || "Unkown";

    const rawData =
      typeof req.body.data === "string"
        ? JSON.parse(req.body.data)
        : req.body.data || req.body;

    const clientData = rawData?.create_client_data || rawData;

    const authResult = await createEmployeeService(
      clientData,
      origin,
      device,
      file,
    );

    res
      .status(201)
      .json(
        createResponseHelper(
          true,
          { tokens: authResult },
          "SUCCESS.CLIENT.CREATED",
        ),
      );
  } catch (error: any) {
    if (req.file && req.file.filename) {
      try {
        await cloudinary.uploader.destroy(req.file.filename);
      } catch (cloudinaryError) {
        console.error(
          "No se pudo borrar el archivo fantasma de Cloudinary:",
          cloudinaryError,
        );
      }
    }

    next(error);
  }
};
