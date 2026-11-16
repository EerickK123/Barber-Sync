import { Op } from "sequelize";
import { Reservation } from "../../../db/model";
import Dayjs from "../../../lib/dayjs";

export const checkExpiredReservationsTask = async (): Promise<void> => {
  const now = Dayjs();
  const todayStr = now.format("YYYY-MM-DD");

  const reservations = await Reservation.findAll({
    where: {
      reservation_status: 1,
      reservation_datetime: {
        [Op.between]: [`${Dayjs().subtract(600, "day").format("YYYY-MM-DD")} 00:00:00`, `${todayStr} 23:59:59`],
      },
    },
  });

  console.log(
    `[CRON] Verificando ${reservations.length} reservas pendientes hoy.`,
  );

  for (const reservation of reservations) {
    const reservation_id = reservation.getDataValue("reservation_id");
    const datetime = reservation.getDataValue("reservation_datetime");
    const occupied_slots =
      reservation.getDataValue("reservation_occupied_slots") || 0;

    const expirationDate = Dayjs(datetime).add(occupied_slots * 5, "minute");

    if (expirationDate.isBefore(now)) {
      try {
        await Reservation.update(
          { reservation_status: 2 },
          { where: { reservation_id } },
        );
        console.log(
          `[CRON] ✅ Reserva ${reservation_id} marcada como completada.`,
        );
      } catch (error) {
        console.error(
          `[CRON] ❌ Error al actualizar reserva ${reservation_id}:`,
          error,
        );
      }
    }
  }
};
