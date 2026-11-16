import { db_pool } from "../../../config/db-config";
import { ModelDefined, DataTypes } from "sequelize";
import { RefreshTokenAttributes } from "./types/refresh_tokens.types";

export const RefreshToken: ModelDefined<RefreshTokenAttributes, {}> = db_pool.define(
  "RefreshToken",
  {
    rt_id:         { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    rt_user:       { type: DataTypes.STRING(36), allowNull: false },
    rt_token:      { type: DataTypes.STRING(512), allowNull: false },
    rt_device:     { type: DataTypes.STRING(255), allowNull: false },
    rt_expires_at: { type: DataTypes.DATE, allowNull: false },
    rt_created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  { tableName: "refresh_tokens", timestamps: false },
);