import {
  ActionCode,
  Admin,
  Barbershop,
  BarbershopGallery,
  BarbershopByClient,
  Client,
  Employee,
  Log,
  Reservation,
  Role,
  Schedule,
  ServiceByBarbershop,
  ServiceByEmployee,
  Status,
  User,
  RefreshToken,
  NotificationToken,
  NotificationPreference,
} from "../index";

export const setupAssociations = () => {
  // --- ROLE & USER ---
  Role.hasMany(User, { foreignKey: "user_role" });
  User.belongsTo(Role, { foreignKey: "user_role", as: "Role" });

  // --- ADMIN & CLIENT PROFILES ---
  User.hasOne(Admin, { foreignKey: "admin_user", as: "AdminProfile" });
  Admin.belongsTo(User, { foreignKey: "admin_user", as: "User" });

  User.hasOne(Client, { foreignKey: "client_user", as: "ClientProfile" });
  Client.belongsTo(User, { foreignKey: "client_user", as: "User" });

  // --- BARBERSHOP & ADMIN ---
  Admin.hasMany(Barbershop, {
    foreignKey: "barbershop_admin",
    as: "ManagedBarbershops",
  });
  Barbershop.belongsTo(Admin, { foreignKey: "barbershop_admin", as: "Admin" });

  // --- BARBERSHOP GALLERY ---
  Barbershop.hasMany(BarbershopGallery, {
    foreignKey: "gallery_barbershop",
    as: "Gallery",
  });
  BarbershopGallery.belongsTo(Barbershop, { foreignKey: "gallery_barbershop" });

  // --- BARBERSHOP CLIENTS ---
  Barbershop.hasMany(BarbershopByClient, {
    foreignKey: "bxc_barbershop",
    as: "BarbershopClients",
  });
  BarbershopByClient.belongsTo(Barbershop, { foreignKey: "bxc_barbershop" });
  User.hasMany(BarbershopByClient, {
    foreignKey: "bxc_client",
    as: "VisitedBarbershops",
  });
  BarbershopByClient.belongsTo(User, {
    foreignKey: "bxc_client",
    as: "Client",
  });

  // --- EMPLOYEES ---
  Barbershop.hasMany(Employee, {
    foreignKey: "employee_barbershop",
    as: "Employees",
  });
  Employee.belongsTo(Barbershop, {
    foreignKey: "employee_barbershop",
    as: "Barbershop",
  });
  User.hasMany(Employee, {
    foreignKey: "employee_user",
    as: "EmployeeProfiles",
  });
  Employee.belongsTo(User, { foreignKey: "employee_user", as: "User" });

  // --- SCHEDULE ---
  Barbershop.hasMany(Schedule, {
    foreignKey: "schedule_barbershop",
    as: "Schedules",
  });
  Schedule.belongsTo(Barbershop, { foreignKey: "schedule_barbershop" });

  // --- SERVICES ---
  Barbershop.hasMany(ServiceByBarbershop, {
    foreignKey: "sxb_barbershop",
    as: "BarbershopServices",
  });
  ServiceByBarbershop.belongsTo(Barbershop, { foreignKey: "sxb_barbershop" });

  Employee.hasMany(ServiceByEmployee, {
    foreignKey: "sxe_employee",
    as: "EmployeeServices",
  });
  ServiceByEmployee.belongsTo(Employee, { foreignKey: "sxe_employee" });
  ServiceByBarbershop.hasMany(ServiceByEmployee, {
    foreignKey: "sxe_service",
    as: "Providers",
  });
  ServiceByEmployee.belongsTo(ServiceByBarbershop, {
    foreignKey: "sxe_service",
    as: "ServiceDetails",
  });

  // --- RESERVATIONS ---
  User.hasMany(Reservation, {
    foreignKey: "reservation_client",
    as: "UserReservations",
  });
  Reservation.belongsTo(User, {
    foreignKey: "reservation_client",
    as: "Client",
  });
  Employee.hasMany(Reservation, {
    foreignKey: "reservation_employee",
    as: "Reservations",
  });
  Reservation.belongsTo(Employee, {
    foreignKey: "reservation_employee",
    as: "Employee",
  });
  ServiceByBarbershop.hasMany(Reservation, {
    foreignKey: "reservation_service",
  });
  Reservation.belongsTo(ServiceByBarbershop, {
    foreignKey: "reservation_service",
    as: "ServiceDetails",
  });
  Barbershop.hasMany(Reservation, {
    foreignKey: "reservation_barbershop",
    as: "BarbershopReservations",
  });
  Reservation.belongsTo(Barbershop, {
    foreignKey: "reservation_barbershop",
    as: "Barbershop",
  });
  Status.hasMany(Reservation, { foreignKey: "reservation_status" });
  Reservation.belongsTo(Status, {
    foreignKey: "reservation_status",
    as: "Status",
  });

  // --- LOGS ---
  Barbershop.hasMany(Log, { foreignKey: "log_barbershop", as: "Logs" });
  Log.belongsTo(Barbershop, { foreignKey: "log_barbershop" });
  User.hasMany(Log, { foreignKey: "log_user", as: "Logs" });
  Log.belongsTo(User, { foreignKey: "log_user" });
  ActionCode.hasMany(Log, { foreignKey: "log_action_code" });
  Log.belongsTo(ActionCode, { foreignKey: "log_action_code", as: "Action" });

  User.hasMany(RefreshToken, {
    foreignKey: "rt_user",
    as: "RefreshTokens",
  });
  RefreshToken.belongsTo(User, {
    foreignKey: "rt_user",
    as: "User",
  });

  User.hasMany(NotificationToken, {
    foreignKey: "nt_user",
    as: "NotificationTokens",
  });
  NotificationToken.belongsTo(User, {
    foreignKey: "nt_user",
    as: "User",
  });

  User.hasOne(NotificationPreference, {
    foreignKey: "np_user",
    as: "NotificationPreferences",
  });
  NotificationPreference.belongsTo(User, {
    foreignKey: "np_user",
    as: "User",
  });
};
