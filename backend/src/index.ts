import { app } from "./app";
import { initCronJobs } from "./global/cron/start/start.cron";

const main = () => {
  app(Number(process.env.PORT));
  setTimeout(() => {
    initCronJobs();
  }, 2000);

};

main();
