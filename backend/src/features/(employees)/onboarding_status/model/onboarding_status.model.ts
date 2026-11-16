import { Employee, ServiceByEmployee } from "../../../../global/db/model";

export const checkEmployeeBarbershopLink = async (uuid: string) => {
  return await Employee.findOne({
    where: { employee_user: uuid, employee_is_active: 1 },
    attributes: ["employee_id", "employee_barbershop"],
  });
};

export const checkEmployeeServicesCount = async (employeeId: number) => {
  return await ServiceByEmployee.count({
    where: { sxe_employee: employeeId },
  });
};