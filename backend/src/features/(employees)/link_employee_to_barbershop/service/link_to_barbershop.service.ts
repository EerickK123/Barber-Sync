import {
  findBarbershopById,
  updateBarbershopPrivateCode,
  linkEmployeeToBarbershop,
} from "../model/link_to_barbershop.model";
import { throwErrorHelper } from "../../../../global/helpers";


export const joinEmployeeByPrivateCodeService = async (
  employee_uuid: string,
  private_code: string,
) => {
  const barbershop_id = parseInt(private_code.split("-C")[1], 10);

  const barbershop = await findBarbershopById(barbershop_id);
  if (!barbershop) throwErrorHelper("ERROR.BARBERSHOP.NOT_FOUND", 404);

  const created = await linkEmployeeToBarbershop(barbershop_id, employee_uuid);
  if (!created) throwErrorHelper("ERROR.EMPLOYEE.ALREADY_LINKED", 409);

  await rotatePrivateCode(barbershop_id);

  return created;
};

const generatePrivateCode = (barbershopId: number): string => {
  const characters = {
    alphaNumerics: "0123456789ABDEFGHIJKLMNOPQRSTUVWXYZ",
    letters: "ABDEFGHIJKLMNOPQRSTUVWXYZ",
  };

  const randomCharacter = (str: string) =>
    str.charAt(Math.floor(Math.random() * str.length));

  const randomLetter = randomCharacter(characters.letters);

  const numberBlock = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");

  const alphaNumericBlock = Array.from({ length: 3 }, () =>
    randomCharacter(characters.alphaNumerics),
  ).join("");

  const mixedBlock =
    Math.floor(Math.random() * 10).toString() +
    randomCharacter(characters.alphaNumerics) +
    randomCharacter(characters.letters);

  return `${randomLetter}-${numberBlock}-${alphaNumericBlock}-${mixedBlock}-C${barbershopId}`;
};

const rotatePrivateCode = async (id: number) => {
  const newCode = generatePrivateCode(id);
  await updateBarbershopPrivateCode(id, newCode);
};