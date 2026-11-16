import { db_pool } from "../../../config/db-config";
import { ModelDefined, DataTypes } from "sequelize";
import { BarbershopByClientAttributes } from "./types/bxc.types";

export const BarbershopByClient: ModelDefined<
  BarbershopByClientAttributes,
  {}
> = db_pool.define(
  "BarbershopClient",
  {
    bxc_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    bxc_barbershop: { type: DataTypes.INTEGER, allowNull: false },
    bxc_client: { type: DataTypes.STRING(36), allowNull: false },
  },
  { tableName: "barbershops_by_client", timestamps: false },
);
