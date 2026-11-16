import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import customParseFormat from "dayjs/plugin/customParseFormat";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import "dayjs/locale/es";
import duration from "dayjs/plugin/duration";

dayjs.extend(duration);
dayjs.extend(isBetween);
dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(timezone);

dayjs.locale("es");
dayjs.tz.setDefault("America/Bogota");

export default dayjs;
