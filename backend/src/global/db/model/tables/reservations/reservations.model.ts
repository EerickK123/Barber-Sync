import { db_pool } from "../../../config/db-config";
import { ModelDefined, DataTypes } from "sequelize";
import { ReservationAttributes } from "./types/reservations.types";

export const Reservation: ModelDefined<ReservationAttributes, {}> =
  db_pool.define(
    "Reservation",
    {
      reservation_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      reservation_client: { type: DataTypes.STRING(36), allowNull: false },
      reservation_employee: { type: DataTypes.INTEGER, allowNull: false },
      reservation_service: { type: DataTypes.INTEGER, allowNull: false },
      reservation_barbershop: { type: DataTypes.INTEGER, allowNull: false },
      reservation_datetime: { type: DataTypes.DATE, allowNull: false },
      reservation_start_slot: { type: DataTypes.INTEGER, allowNull: false },
      reservation_occupied_slots: { type: DataTypes.INTEGER, allowNull: false },
      reservation_status: { type: DataTypes.INTEGER, allowNull: false },
      reservation_created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    { tableName: "reservations", timestamps: false },
  );
