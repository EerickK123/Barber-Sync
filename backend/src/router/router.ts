import { Router } from "express";
import publicRoutes from "../features/features.public.routes";
import privateRoutes from "../features/features.private.routes";
import { authMiddleware } from "../global/middlewares";

const router = Router();

router.use("/public", publicRoutes);

router.use("/private", authMiddleware, privateRoutes);

export default router;

/*
f
/--------------/ cliente routes /------------------/


export const API_ROUTES = {
  TEST: {
    CONNECTION: '/',
  },
  PUBLIC: {
    LOGIN: 'api/public/auth/login',
    REGISTER: 'api/public/clients/register',
    REFRESH: 'api/public/session/refresh',
  },

  PRIVATE: {
    REGISTER_PUSH_TOKEN: 'api/private/notifications/registerPushToken'
    GET_CLIENT_PROFILE: 'api/private/clients/getClientProfile',
    UPDATE_CLIENT_PROFILE: 'api/private/clients/updateClientProfile',
    GET_BARBERSHOPS: 'api/private/clients/getBarbershops',
    GET_BARBERSHOP_PROFILE: 'api/private/clients/getBarbershopProfile',
    JOIN_BARBERSHOP: 'api/private/clients/joinBarbershop',
    CREATE_RESERVATION: 'api/private/clients/createReservation',
    GET_RESERVATIONS: 'api/private/clients/getClientReservations',
    UPDATE_RESERVATION: 'api/private/clients/updateReservations',
  },
} as const;
*/

/*

/--------------/ employee routes /------------------/


export const API_ROUTES = {
  TEST: {
    CONNECTION: '/',
  },
  PUBLIC: {
    LOGIN: 'api/public/auth/login', 
    REGISTER: 'api/public/employees/register',
    REFRESH: 'api/public/session/refresh',
  },
  PRIVATE: {
    REGISTER_PUSH_TOKEN: 'api/private/notifications/registerPushToken'
    LINK_TO_BARBERSHOP: "api/private/employees/linkEmployeeToBarbershop", 
    GET_BARBERSHOP_SERVICES: "api/private/employees/getBarbershopServices",
    SYNC_EMPLOYEE_SERVICES: "api/private/employees/syncEmployeeServices",
    GET_ONBOARDING_STATUS: "api/private/employees/getOnboardingStatus",

  },
} as const;
*/
