import cron from "node-cron";
import { checkExpiredReservationsTask } from "../tasks";
// import { tuTareaDiaria } from "../tasks/daily.task";

export const initCronJobs = (): void => {
  console.log("⏰ [CRON] Motor de tareas automáticas iniciado...");
  HourlyJobs();
  //DailyJobs();
};

const HourlyJobs = () => {
  cron.schedule("0 * * * *", async () => {
    try {
      await checkExpiredReservationsTask();
      console.log("⏰ [CRON] Tareas por hora TERMINADAS.");
    } catch (error) {
      console.error(
        "❌ [CRON CRITICAL ERROR] Falló la ejecución de las tareas por hora:",
        error,
      );
    }
  });
};



const DailyJobs = () => {
  cron.schedule("59 23 * * *", async () => {
    try {
      // await tuTareaDiaria();
      console.log("⏰ [CRON] Tareas diarias TERMINADAS.");
    } catch (error) {
      console.error(
        "❌ [CRON CRITICAL ERROR] Falló la ejecución de las tareas diarias:",
        error,
      );
    }
  });
};
