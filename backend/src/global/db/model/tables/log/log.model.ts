import { db_pool } from "../../../config/db-config";
import { ModelDefined, DataTypes } from "sequelize";
import { LogAttributes } from "./types/log.types";

export const Log: ModelDefined<LogAttributes, {}> = db_pool.define(
  "Log",
  {
    log_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    log_barbershop: { type: DataTypes.INTEGER, allowNull: false },
    log_user: { type: DataTypes.STRING(36), allowNull: false },
    log_action_code: { type: DataTypes.INTEGER, allowNull: false },
    log_description: { type: DataTypes.STRING(255), allowNull: true },
    log_created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  { tableName: "log", timestamps: false },
);
