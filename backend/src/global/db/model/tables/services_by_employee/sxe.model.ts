import { db_pool } from "../../../config/db-config";
import { ModelDefined, DataTypes } from "sequelize";
import { ServiceByEmployeeAttributes } from "./types/sxe.types";

export const ServiceByEmployee: ModelDefined<ServiceByEmployeeAttributes, {}> =
  db_pool.define(
    "ServiceByEmployee",
    {
      sxe_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      sxe_employee: { type: DataTypes.INTEGER, allowNull: false },
      sxe_service: { type: DataTypes.INTEGER, allowNull: false },
    },
    { tableName: "services_by_employees", timestamps: false },
  );
