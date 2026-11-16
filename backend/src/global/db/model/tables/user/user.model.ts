import { db_pool } from "../../../config/db-config";
import { ModelDefined, DataTypes } from "sequelize";
import { UserAttributes } from "./types/user.types";

export const User: ModelDefined<UserAttributes, {}> = db_pool.define(
  "User",
  {
    uuid: { type: DataTypes.STRING(36), primaryKey: true },
    user_role: { type: DataTypes.INTEGER, allowNull: false },
    user_name: { type: DataTypes.STRING(100), allowNull: false },
    user_lastname: { type: DataTypes.STRING(100), allowNull: false },
    user_email: { type: DataTypes.STRING(150), allowNull: false, unique: true },
    user_phone: { type: DataTypes.STRING(20), allowNull: false, unique: true },
    user_password: { type: DataTypes.STRING(255), allowNull: false },
    user_avatar: { type: DataTypes.STRING(255), allowNull: true },
  },
  { tableName: "users", timestamps: false },
);
