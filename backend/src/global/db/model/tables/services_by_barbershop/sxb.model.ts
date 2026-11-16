import { db_pool } from "../../../config/db-config";
import { ModelDefined, DataTypes } from "sequelize";
import { ServiceByBarbershopAttributes } from "./types/sxb.types";

export const ServiceByBarbershop: ModelDefined<
  ServiceByBarbershopAttributes,
  {}
> = db_pool.define(
  "ServiceByBarbershop",
  {
    sxb_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    sxb_barbershop: { type: DataTypes.INTEGER, allowNull: false },
    sxb_service_name: { type: DataTypes.STRING(150), allowNull: false },
    sxb_service_duration: { type: DataTypes.TIME, allowNull: false },
    sxb_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0,
    },
  },
  { tableName: "services_by_barbershop", timestamps: false },
);
