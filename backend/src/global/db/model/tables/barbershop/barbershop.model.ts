import { db_pool } from "../../../config/db-config";
import { ModelDefined, DataTypes } from "sequelize";
import { BarbershopAttributes } from "./types/barbershop.types";

export const Barbershop: ModelDefined<BarbershopAttributes, {}> =
  db_pool.define(
    "Barbershop",
    {
      barbershop_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      barbershop_admin: { type: DataTypes.INTEGER, allowNull: false },
      barbershop_name: { type: DataTypes.STRING(150), allowNull: false },
      barbershop_phone: { type: DataTypes.STRING(20), allowNull: false },
      barbershop_code: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
      barbershop_private_code: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
      barbershop_address: { type: DataTypes.STRING(200), allowNull: false },
      barbershop_description: { type: DataTypes.STRING(500), allowNull: true },
      barbershop_cover_url: { type: DataTypes.STRING(255), allowNull: true },
      barbershop_profile_url: { type: DataTypes.STRING(255), allowNull: true },
      barbershop_tier: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 1,
      },
      barbershop_is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    { tableName: "barbershops", timestamps: false },
  );