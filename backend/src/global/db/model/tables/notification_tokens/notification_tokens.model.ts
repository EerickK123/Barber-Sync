import { db_pool } from "../../../config/db-config";
import { ModelDefined, DataTypes } from "sequelize";
import { NotificationTokenAttributes } from "./types/notification_token.types";

export const NotificationToken: ModelDefined<NotificationTokenAttributes, {}> =
  db_pool.define(
    "NotificationToken",
    {
      nt_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nt_user: { type: DataTypes.STRING(36), allowNull: false },
      nt_token: { type: DataTypes.STRING(512), allowNull: false, unique: true },
      nt_device_type: {
        type: DataTypes.ENUM("android", "ios", "web"),
        allowNull: false,
      },
      nt_created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      nt_updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    { tableName: "notification_tokens", timestamps: false },
  );
