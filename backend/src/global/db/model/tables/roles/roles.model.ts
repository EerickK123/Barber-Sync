import { db_pool } from "../../../config/db-config";
import { ModelDefined, DataTypes } from "sequelize";
import { RoleAttributes } from "./types/roles.types";

export const Role: ModelDefined<RoleAttributes, {}> = db_pool.define(
  "Role",
  {
    role_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    role_name: { type: DataTypes.STRING(100), allowNull: false, unique: true },
  },
  { tableName: "role", timestamps: false },
);
