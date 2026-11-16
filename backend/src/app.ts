import express from "express";
import cors from "cors";
import router from "./router/router";
import { globalErrorHandler } from "./global/middlewares";
import { ApiResponse } from "./global/types/global-types";
import { setupAssociations } from "./global/db/model";
import { db_pool } from "./global/db/config/db-config";
import dotenv from "dotenv";

export const app = async (port: number = 3000) => {
  dotenv.config();
  const App = express();
  App.use(cors());
  App.use(express.json());
 
  setupAssociations();  

  try {
    await db_pool.authenticate();
    console.log("Conexión a la base de datos establecida correctamente.");
  } catch (error) {
    console.error("No se pudo conectar a la base de datos:", error);
    process.exit(1);
  }

  App.get("/", (req, res) => {
    const testResponse: ApiResponse<any> = {
      success: true,
      result: {
        Headers: req.headers,
      },
      message: "backend en linea",
    };
    res.json(testResponse);
  });

  App.use("/api", router);
  App.use(globalErrorHandler);
  App.listen(port, () => {
    console.log(`Servidor corriendo en la red local en el puerto ${port}`);
  });

  return App;
};