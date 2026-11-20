// Validaciones locales de la práctica; no autentican contra un servidor.
export function validateLogin(email: string, password: string): string[] {
  const errors: string[] = [];
  const normalizedEmail = email.trim();
  if (!normalizedEmail) {
    errors.push("El correo electrónico no puede estar vacío.");
  } else if (!/^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/.test(normalizedEmail)) {
    errors.push("Ingresa un correo electrónico válido.");
  }
  if (!password.trim()) {
    errors.push("La contraseña no puede estar vacía.");
  } else {
    if (password.length < 8) errors.push("La contraseña debe tener al menos 8 caracteres.");
    if (!/\p{Lu}/u.test(password)) errors.push("La contraseña debe incluir al menos una mayúscula.");
    if (!/\p{Ll}/u.test(password)) errors.push("La contraseña debe incluir al menos una minúscula.");
    if (!/[^\p{L}\p{N}\s]/u.test(password)) errors.push("La contraseña debe incluir al menos un carácter especial.");
  }
  return errors;
}
