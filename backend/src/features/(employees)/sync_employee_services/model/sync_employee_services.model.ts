import { Employee, ServiceByEmployee, ServiceByBarbershop } from "../../../../global/db/model";
import { Op } from "sequelize";

export const getEmployeeDataByUuid = async (uuid: string) => {
  return await Employee.findOne({
    where: { employee_user: uuid, employee_is_active: 1 },
    attributes: ["employee_id", "employee_barbershop"],
  });
};

export const countValidBarbershopServices = async (barbershopId: number, serviceIds: number[]) => {
  return await ServiceByBarbershop.count({
    where: {
      sxb_barbershop: barbershopId,
      sxb_id: { [Op.in]: serviceIds },
    },
  });
};

export const clearAndInsertEmployeeServices = async (employeeId: number, serviceIds: number[]) => {
  await ServiceByEmployee.destroy({
    where: { sxe_employee: employeeId },
  });

  const bulkData = serviceIds.map((id) => ({
    sxe_employee: employeeId,
    sxe_service: id,
  }));

  await ServiceByEmployee.bulkCreate(bulkData);
  
  return true;
};