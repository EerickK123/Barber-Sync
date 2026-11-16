import Constants from "expo-constants";

const apiUrl = Constants.expoConfig?.extra?.apiUrl || "URL_NO_DEFINIDA";

export const API_CONFIG = {
  BASE_URL: apiUrl,
  TIMEOUT: 10000,
  HEADERS: {
    'Content-Type': 'application/json',
    'x-app-origin': 'x-client-app',
  },
} as const;

export const API_ROUTES = {
  TEST: {
    CONNECTION: '/',
  },
  PUBLIC: {
    LOGIN: '/api/public/auth/login/',
    REGISTER: '/api/public/clients/register/',
    REFRESH: '/api/public/session/refresh/',
  },
  PRIVATE: {
    GET_CLIENT_PROFILE: '/api/private/clients/getClientProfile',
    GET_BARBERSHOPS: '/api/private/clients/getBarbershops',
    GET_BARBERSHOP_PROFILE: '/api/private/clients/getBarbershopProfile',
    GET_RESERVATIONS: '/api/private/clients/getClientReservations',
    JOIN_BARBERSHOP: '/api/private/clients/joinBarbershop',
    CREATE_RESERVATION: '/api/private/clients/createReservation',
    UPDATE_CLIENT_PROFILE: '/api/private/clients/updateClientProfile',
    UPDATE_RESERVATION: '/api/private/clients/updateReservations',
  },
} as const;