import { getBarbershopServicesByEmployeeUuid } from "../model/get_barbershop_services.model";
import { throwErrorHelper } from "../../../../global/helpers";
import { IServiceOutput } from "../types/get_barbershop_services.types";

export const getBarbershopServicesListService = async (
  employee_uuid: string,
) => {
  const rawServices = await getBarbershopServicesByEmployeeUuid(employee_uuid);

  if (!rawServices) {
    throwErrorHelper("ERROR.EMPLOYEE.NOT_FOUND_OR_INACTIVE", 404);
  }

  const processedServices = rawServices.map((service: any) => ({
    id: service.get("sxb_id") as number,
    name: service.get("sxb_service_name") as string,
  }));

  return processedServices as IServiceOutput[];
};
