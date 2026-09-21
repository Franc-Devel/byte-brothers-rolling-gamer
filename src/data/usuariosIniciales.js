const ADMIN_EMAIL = import.meta.env?.VITE_ADMIN_EMAIL || "admin@rollinggames.com";
const ADMIN_PASSWORD = import.meta.env?.VITE_ADMIN_PASSWORD || "Admin123!";
export const usuariosIniciales = [
  {
    id: "u-admin-1",
    nombre: "Francisco Delgado",
    email: ADMIN_EMAIL,
    correo: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    contrasenia: ADMIN_PASSWORD,
    rol: "admin",
    fechaRegistro: "2024-01-10",
    fecha: "2024-01-10",
    wishlist: ["1", "2"]
  },
  {
    id: "u-user-2",
    nombre: "Franco Triviño",
    email: "user@rollinggames.com",
    correo: "user@rollinggames.com",
    password: "User123!",
    contrasenia: "User123!",
    rol: "usuario",
    fechaRegistro: "2024-02-15",
    fecha: "2024-02-15",
    wishlist: ["3", "5"]
  }
];
export default usuariosIniciales;
