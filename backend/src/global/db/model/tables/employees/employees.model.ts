import { db_pool } from "../../../config/db-config";
import { ModelDefined, DataTypes } from "sequelize";
import { EmployeeAttributes } from "./types/employees.types";

export const Employee: ModelDefined<EmployeeAttributes, {}> = db_pool.define(
  "Employee",
  {
    employee_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    employee_barbershop: { type: DataTypes.INTEGER, allowNull: false },
    employee_user: { type: DataTypes.STRING(36), allowNull: false },
    employee_is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  { tableName: "employees", timestamps: false },
);
