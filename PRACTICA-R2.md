# Práctica R2: login y pruebas

## 1. Mostrar las pruebas automáticas como en la captura

En Visual Studio Code, abre Terminal → Nueva terminal. Ejecuta:

```powershell
cd "D:\5to semestre\Programación movil\MiAppExpo"
npm test -- --colors
```

No necesitas abrir el emulador para estas pruebas. Las dependencias ya están instaladas en esta computadora. Si copias el proyecto a otra computadora, ejecuta primero `npm install`.

La salida debe incluir:

```text
PASS __tests__/index.test.tsx
  Index (pantalla de login)
    ...
Test Suites: 1 passed, 1 total
Tests:       15 passed, 15 total
```

Los tiempos cambian en cada ejecución. Amplía la terminal para mostrar la lista completa. Usa Windows + Shift + S para tomar una captura y guardarla como evidencia. Si aparece FAIL, revisa el detalle: no es un resultado aprobado.

Las pruebas están en `__tests__/index.test.tsx`, fuera de `src/app` para que Expo Router no las interprete como una pantalla. Comprueban:

1. Imagen, etiquetas, campos y botón.
2. Alerta con ambos campos vacíos.
3. Alerta con solo el correo vacío.
4. Alerta con solo la contraseña vacía.
5. Contraseña oculta con `secureTextEntry`.
6. Teclado de correo electrónico.
7. Correos válidos.
8. Correos inválidos.
9. Contraseñas válidas.
10. Contraseñas sin mayúsculas.
11. Contraseñas sin minúsculas.
12. Contraseñas sin carácter especial (un espacio no cuenta).
13. Contraseñas con menos de ocho caracteres.
14. Contraseñas con solo números y símbolos.
15. El botón Registro abre la ruta /register sin validar los campos del login.

Las pruebas renderizan la pantalla, cambian los campos y pulsan el botón. Reemplazan el diálogo nativo para observar su mensaje y el router para comprobar la ruta solicitada; ejecutan las validaciones reales. Comprueban propiedades y comportamiento del formulario, no el aspecto visual real del emulador.

## 2. Demostrar el formulario en el teléfono

En otra terminal, desde la misma carpeta, ejecuta:

```powershell
npm run android
```

Si Expo ya está encendido y la app está abierta, usa esa sesión. Para reiniciarlo, detén la sesión anterior con Ctrl+C antes de ejecutar el comando. Mantén la terminal del servidor abierta mientras usas el emulador.

Escribe cada combinación y pulsa Ingresar. Cierra la alerta con OK antes del siguiente caso.

| Prueba | Correo | Contraseña | Resultado esperado |
| --- | --- | --- | --- |
| Ambos vacíos | Dejar vacío | Dejar vacío | Ambos campos son obligatorios |
| Solo correo vacío | Dejar vacío | Ejemplo1! | Correo obligatorio |
| Solo contraseña vacía | alumno@example.com | Dejar vacío | Contraseña obligatoria |
| Correo inválido | alumno | Ejemplo1! | Correo inválido |
| Muy corta | alumno@example.com | Abcdef! | Mínimo 8 caracteres |
| Sin mayúscula | alumno@example.com | ejemplo1! | Falta una mayúscula |
| Sin minúscula | alumno@example.com | EJEMPLO1! | Falta una minúscula |
| Sin símbolo | alumno@example.com | Ejemplo12 | Falta un carácter especial |
| Solo números y símbolo | alumno@example.com | 1234567! | Faltan mayúscula y minúscula |
| Datos válidos | alumno@example.com | Ejemplo1! | Validación exitosa |

Muestra también que la contraseña aparece oculta. Al enfocar el correo, Android usa el teclado de correo si está visible el teclado virtual.

Este ejercicio valida el formato de los datos. No comprueba cuentas ni contraseñas contra un servidor.

## Otras comprobaciones

- `npm run test:validaciones`: 18 casos adicionales de la función de validación.
- `npx tsc --noEmit`: revisión de tipos.
- `npm run lint`: revisión de código.
- `npm run test:watch`: repite pruebas al guardar cambios; pulsa q para salir.

La pantalla está en `src/app/index.tsx` y las reglas en `src/utils/validate-login.ts`. El botón Registro abre `src/app/register.tsx`: una pantalla blanca con el texto Register. El layout declara index y register, y muestra una flecha para volver al login. La carpeta `example` es la plantilla anterior y está excluida de las comprobaciones del proyecto activo.

Configuración basada en la guía oficial de Expo: https://docs.expo.dev/develop/unit-testing/

