import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

export const db_pool = new Sequelize(
  process.env.DB_NAME as string,
  process.env.DB_USER as string,
  process.env.DB_PASSWORD as string,
  {
    host: process.env.DB_HOST as string,
    dialect: "mysql",
    timezone: "+00:00",
    dialectOptions: {
      dateStrings: true,
      typeCast: true,
    },
    logging: false,
    pool: {
      max: 20,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  },
);