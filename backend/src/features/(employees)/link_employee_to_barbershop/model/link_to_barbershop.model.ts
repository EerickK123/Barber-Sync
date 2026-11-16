import { Barbershop, Employee } from "../../../../global/db/model";
import { Transaction } from "sequelize";


export const findBarbershopById = async (id: number) => {
  return await Barbershop.findByPk(id, { attributes: ["barbershop_id"] });
};

export const updateBarbershopPrivateCode = async (
  id: number,
  newCode: string,
  transaction?: Transaction,
) => {
  return await Barbershop.update(
    { barbershop_private_code: newCode },
    { where: { barbershop_id: id }, transaction },
  );
};

export const linkEmployeeToBarbershop = async (
  id: number,
  uuid: string,
  transaction?: Transaction,
) => {
  const [, created] = await Employee.findOrCreate({
    where: { employee_barbershop: id, employee_user: uuid },
    defaults: { employee_barbershop: id, employee_user: uuid },
    transaction,
  });
  return created;
};