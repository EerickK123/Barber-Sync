import {BarbershopItem} from "../../../types/get_barbershops.types"


export interface BarbershopCardProps {
  data: BarbershopItem;
  onPress: () => void;
}