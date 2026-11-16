import { db_pool } from "../../../config/db-config";
import { ModelDefined, DataTypes } from "sequelize";
import { NotificationPreferenceAttributes } from "./types/notifications_preferences.types";

export const NotificationPreference: ModelDefined<
  NotificationPreferenceAttributes,
  {}
> = db_pool.define(
  "NotificationPreference",
  {
    np_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    np_user: { type: DataTypes.STRING(36), allowNull: false, unique: true },
    np_push: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    np_email: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    np_sms: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    np_whatsapp: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    np_created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    np_updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  { tableName: "notification_preferences", timestamps: false },
);
