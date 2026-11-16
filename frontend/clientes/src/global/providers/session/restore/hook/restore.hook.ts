import { useContext } from 'react';

import { RestoreContext } from '../provider/restore.provider';

export const useRestore = () => {
  return useContext(RestoreContext);
};
