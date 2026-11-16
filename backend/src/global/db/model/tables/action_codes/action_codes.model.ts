import { db_pool } from "../../../config/db-config";
import { ModelDefined, DataTypes } from "sequelize";
import { ActionCodeAttributes } from "./types/action_codes.types";

export const ActionCode: ModelDefined<ActionCodeAttributes, {}> =
  db_pool.define(
    "ActionCode",
    {
      action_code_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      action_code: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
    },
    { tableName: "action_codes", timestamps: false },
  );
