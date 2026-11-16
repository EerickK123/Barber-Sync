export interface LogAttributes {
  log_id?: number;
  log_barbershop: number;
  log_user: string;
  log_action_code: number;
  log_description?: string | null;
  log_created_at?: Date;
}