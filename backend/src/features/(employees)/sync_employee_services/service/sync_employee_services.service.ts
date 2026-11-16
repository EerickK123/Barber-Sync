import {
  getEmployeeDataByUuid,
  countValidBarbershopServices,
  clearAndInsertEmployeeServices,
} from "../model/sync_employee_services.model";
import { throwErrorHelper } from "../../../../global/helpers";

export const syncEmployeeServicesService = async (
  uuid: string,
  service_ids: number[],
) => {
  // 1. Verificar identidad del empleado
  const employee = await getEmployeeDataByUuid(uuid);

  if (!employee) {
    throwErrorHelper("ERROR.EMPLOYEE.NOT_FOUND", 404);
  }

  const employeeId = employee!.get("employee_id") as number;
  const barbershopId = employee!.get("employee_barbershop") as number;

  const validCount = await countValidBarbershopServices(barbershopId, service_ids);
  if (validCount !== service_ids.length) {
    throwErrorHelper("ERROR.SERVICES.INVALID_FOR_BARBERSHOP", 403);
  }

  await clearAndInsertEmployeeServices(employeeId, service_ids);

  return true;
};