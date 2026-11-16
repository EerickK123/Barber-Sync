export interface CustomJwtPayload {
  exp: number;
}

export type refreshPromiseType = Promise<string | null> | null