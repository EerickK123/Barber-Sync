import { db_pool } from "../../../config/db-config";
import { ModelDefined, DataTypes } from "sequelize";
import { BarbershopGalleryAttributes } from "./types/gallery.types";

export const BarbershopGallery: ModelDefined<BarbershopGalleryAttributes, {}> =
  db_pool.define(
    "BarbershopGallery",
    {
      gallery_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      gallery_barbershop: { type: DataTypes.INTEGER, allowNull: false },
      gallery_url: { type: DataTypes.STRING(255), allowNull: false },
      gallery_caption: { type: DataTypes.STRING(150), allowNull: true },
      gallery_created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    },
    { tableName: "barbershop_gallery", timestamps: false },
  );
