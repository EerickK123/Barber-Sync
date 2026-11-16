import { Employee, ServiceByBarbershop } from "../../../../global/db/model";

export const getBarbershopServicesByEmployeeUuid = async (
  employee_uuid: string,
) => {
  const employee = await Employee.findOne({
    where: { employee_user: employee_uuid, employee_is_active: 1 },
    attributes: ["employee_barbershop"],
  });

  const barbershopId = employee!.get("employee_barbershop") as number;

  const services = await ServiceByBarbershop.findAll({
    where: { sxb_barbershop: barbershopId },
    attributes: ["sxb_id", "sxb_service_name"],
  });

  return services;
};
