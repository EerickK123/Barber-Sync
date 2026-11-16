export const throwErrorHelper = (message: string, status: number): never  => {
  const error: any = new Error(message);
  error.status = status;
  throw error;
};