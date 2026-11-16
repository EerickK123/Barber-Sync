import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import { throwErrorHelper } from "../../../../global/helpers";
import {
  updateClientProfileModel,
  findUserByUuidModel,
} from "../model/update_client_profile.model";
import { IUpdateClientProfileData } from "../types/update_client_profile.types";

export const updateClientProfileService = async (
  uuid: string,
  profileData: IUpdateClientProfileData,
  file?: Express.Multer.File,
): Promise<boolean> => {
  const info = profileData.profile_info;

  const dbPayload: Record<string, any> = {
    user_name: info.name,
    user_lastname: info.lastName,
    user_email: info.email,
    user_phone: info.phone,
  };

  // 1. Obtenemos la info del usuario a través del Model (Separación de responsabilidades)
  const currentUser = await findUserByUuidModel(uuid);

  if (!currentUser) {
    if (file) await cleanupCloudinaryFile(file);
    throwErrorHelper("ERROR.CLIENT.USER_NOT_FOUND", 404);
  }

  const { currentPassword, newPassword } = info;

  // 2. Lógica de Contraseñas
  if (currentPassword && newPassword) {
    const dbPasswordHash = currentUser!.getDataValue("user_password");
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      dbPasswordHash,
    );

    if (!isPasswordValid) {
      if (file) await cleanupCloudinaryFile(file); // Rollback en Cloudinary
      throwErrorHelper("ERROR.CLIENT.INVALID_CURRENT_PASSWORD", 400);
    }

    dbPayload.user_password = await bcrypt.hash(newPassword, 12);
  }

  // 3. Preparación del Avatar con Multer-Cloudinary
  const oldAvatarUrl = currentUser!.getDataValue("user_avatar");
  if (file) {
    // Multer-storage-cloudinary guarda la URL segura directamente en file.path
    dbPayload.user_avatar = file.path;
  }

  try {
    // 4. Actualización en Base de Datos
    const isUpdated = await updateClientProfileModel(uuid, dbPayload);

    if (!isUpdated) {
      throwErrorHelper("ERROR.CLIENT.UPDATE_FAILED_OR_NOT_FOUND", 404);
    }

    // --- ÉXITO ---
    // Si la BD se actualizó y hay un archivo viejo en Cloudinary, lo destruimos
    if (file && oldAvatarUrl && oldAvatarUrl.includes("cloudinary.com")) {
      await deleteOldCloudinaryFile(oldAvatarUrl);
    }

    return isUpdated;
  } catch (error) {
    // --- ERROR / ROLLBACK ---
    if (file) {
      await cleanupCloudinaryFile(file);
    }
    throw error;
  }
};

// ============================================================
// FUNCIONES AUXILIARES PARA CLOUDINARY
// ============================================================

/**
 * Rollback: Elimina el archivo recién subido si algo falla.
 * Multer-storage-cloudinary guarda el `public_id` directamente en `file.filename`.
 */
const cleanupCloudinaryFile = async (file: Express.Multer.File) => {
  if (file.filename) {
    try {
      await cloudinary.uploader.destroy(file.filename);
      console.log(
        `[ROLLBACK] Archivo nuevo eliminado de Cloudinary: ${file.filename}`,
      );
    } catch (err) {
      console.error(
        `[ROLLBACK ERROR] No se pudo eliminar el archivo huérfano de Cloudinary: ${file.filename}`,
        err,
      );
    }
  }
};

/**
 * Limpieza: Extrae el `public_id` de la URL vieja y lo borra de Cloudinary.
 */
const deleteOldCloudinaryFile = async (oldUrl: string) => {
  try {
    const publicId = extractCloudinaryPublicId(oldUrl);
    if (publicId) {
      await cloudinary.uploader.destroy(publicId);
      console.log(
        `[CLEANUP] Viejo avatar eliminado de Cloudinary: ${publicId}`,
      );
    }
  } catch (err) {
    console.warn(
      `[CLEANUP WARNING] No se pudo borrar la imagen vieja en Cloudinary:`,
      err,
    );
  }
};

/**
 * Utilidad para sacar el public_id de la URL.
 * Busca la raíz de tus carpetas ("barbernow") y quita la extensión.
 */
const extractCloudinaryPublicId = (url: string): string | null => {
  const parts = url.split("/");
  const startIndex = parts.findIndex((p) => p === "barbernow"); // Tu carpeta raíz según tu config de Multer

  if (startIndex === -1) return null;

  const fileWithExtension = parts.slice(startIndex).join("/");
  const lastDotIndex = fileWithExtension.lastIndexOf(".");

  // Si hay un punto, cortamos la extensión. Si no, devolvemos el string completo.
  return lastDotIndex !== -1
    ? fileWithExtension.substring(0, lastDotIndex)
    : fileWithExtension;
};
