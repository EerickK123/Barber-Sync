import {
  checkEmployeeBarbershopLink,
  checkEmployeeServicesCount,
} from "../model/onboarding_status.model";

export const OnboardingStatusService = async (uuid: string) => {
  const status = {
    barbershopJoined: false,
    syncServices: false,
  };

  const employee = await checkEmployeeBarbershopLink(uuid);
  console.log(employee)
  if (!employee) {
    return status;
  }


  status.barbershopJoined = true;

  const employeeId = employee.dataValues.employee_id as number;
  console.log(employeeId)
  const servicesCount = await checkEmployeeServicesCount(employeeId);

  if (servicesCount > 0) {
    status.syncServices = true;
  }

  return status;
};
