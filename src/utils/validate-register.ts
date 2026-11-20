import { validateLogin } from "./validate-login";

export function validateRegister(
  email: string,
  username: string,
  password: string,
  confirmPassword: string,
): string[] {
  // Reutiliza las mismas reglas de correo y contraseña del login.
  const errors = validateLogin(email, password);
  if (!username.trim()) errors.push("El nombre de usuario no puede estar vacío.");
  if (!confirmPassword.trim()) {
    errors.push("La confirmación de contraseña no puede estar vacía.");
  } else if (password !== confirmPassword) {
    errors.push("Las contraseñas deben coincidir.");
  }
  return errors;
}
