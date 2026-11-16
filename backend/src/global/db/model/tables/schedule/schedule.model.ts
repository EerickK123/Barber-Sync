import { db_pool } from "../../../config/db-config";
import { ModelDefined, DataTypes } from "sequelize";
import { ScheduleAttributes } from "./types/schedule.types";

export const Schedule: ModelDefined<ScheduleAttributes, {}> = db_pool.define(
  "Schedule",
  {
    schedule_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    schedule_barbershop: { type: DataTypes.INTEGER, allowNull: false },
    schedule_day_of_week: { type: DataTypes.INTEGER, allowNull: false },
    schedule_open_time: { type: DataTypes.TIME, allowNull: false },
    schedule_close_time: { type: DataTypes.TIME, allowNull: false },
  },
  { tableName: "schedule", timestamps: false },
);
