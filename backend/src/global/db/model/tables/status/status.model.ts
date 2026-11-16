import { DataTypes, ModelDefined } from "sequelize";
import { db_pool } from "../../../config/db-config";
import { StatusAttributes } from "./types/status.types";

export const Status: ModelDefined<StatusAttributes, {}> = db_pool.define(
  "Status",
  {
    status_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    status: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
  },
  {
    tableName: "status",
    timestamps: false,
  },
);