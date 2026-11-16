import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import path from "path";
import { Request } from "express";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_EXTENSIONS = /jpeg|jpg|png|webp/;
const ALLOWED_MIME_TYPES = /image\/jpeg|image\/jpg|image\/png|image\/webp/;

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (_req: Request, file: Express.Multer.File) => {
    let folderName = "barbernow/general";
    const transformRules: Record<string, string | number>[] = [
      { quality: "auto", fetch_format: "auto" },
    ];

    switch (file.fieldname) {
      case "user_avatar":
        folderName = "barbernow/profiles";
        transformRules.push({
          width: 400,
          height: 400,
          crop: "fill",
          gravity: "face",
        });
        break;
      // cambiar a medida del desarrollo
      case "coverPic":
        folderName = "barbernow/covers";
        transformRules.push({ width: 1200, height: 400, crop: "fill" });
        break;

      case "gallery":
        folderName = "barbernow/gallery";
        transformRules.push({ width: 1080, height: 1080, crop: "limit" });
        break;
    }

    return {
      folder: folderName,
      allowed_formats: ["jpg", "jpeg", "png", "webp"],
      transformation: transformRules,
    };
  },
});

// ============================================================
// MULTER UPLOAD CONFIGURATION
// ============================================================
const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  const extname = ALLOWED_EXTENSIONS.test(
    path.extname(file.originalname).toLowerCase(),
  );
  const mimetype = ALLOWED_MIME_TYPES.test(file.mimetype);

  if (!extname || !mimetype) {
    return cb(new Error("ERROR.MULTER.INVALID_FILE_TYPE"));
  }

  cb(null, true);
};

export const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter,
});
