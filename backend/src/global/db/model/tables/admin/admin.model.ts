import { db_pool } from "../../../config/db-config";
import { ModelDefined, DataTypes } from "sequelize";
import { AdminAttributes } from "./types/admin.types";

export const Admin: ModelDefined<AdminAttributes, {}> = db_pool.define(
  "Admin",
  {
    admin_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    admin_user: { type: DataTypes.STRING(36), allowNull: false, unique: true },
    admin_phone_alt: { type: DataTypes.STRING(20), allowNull: true },
  },
  { tableName: "admins", timestamps: false },
);
