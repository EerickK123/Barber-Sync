import { db_pool } from "../../../config/db-config";
import { ModelDefined, DataTypes } from "sequelize";
import { ClientAttributes } from "./types/client.types";

export const Client: ModelDefined<ClientAttributes, {}> = db_pool.define(
  "Client",
  {
    client_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    client_user: { type: DataTypes.STRING(36), allowNull: false, unique: true },
  },
  { tableName: "clients", timestamps: false },
);
