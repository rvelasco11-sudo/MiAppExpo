# Práctica R4: registro

Abre la app, pulsa Registro y completa los cuatro campos. Se mantiene el diseño sencillo del login.

- El correo debe ser válido (regex).
- Todos los campos son obligatorios; solo espacios se considera vacío.
- Ambas contraseñas están ocultas y deben coincidir exactamente.
- La contraseña requiere mínimo 8 caracteres, mayúsculas, minúsculas y un carácter especial. Un espacio no cuenta como símbolo.
- Registrarse muestra una alerta con los errores. Si todo es válido, vuelve al index (login).
- Atrás permite volver sin llenar el formulario. También está disponible la flecha del encabezado al llegar desde el login.

Ejemplo válido:

| Campo | Valor |
| --- | --- |
| Correo electrónico | alumno@example.com |
| Nombre de usuario | rogelio |
| Contraseña | Ejemplo1! |
| Confirmar contraseña | Ejemplo1! |

Para mostrar un error, cambia la confirmación a `OtraClave1!` y pulsa Registrarse. Debe indicar que las contraseñas deben coincidir. También puedes dejar campos vacíos o probar una contraseña como `ejemplo1!` para mostrar el aviso de mayúscula faltante.

## Pruebas automáticas

Desde MiAppExpo, ejecuta:

```powershell
npm.cmd test -- --colors
```

Resultado verificado: 2 suites aprobadas, 32 pruebas aprobadas (15 del login y 17 del registro).

Para ejecutar únicamente registro:

```powershell
npm.cmd test -- --runTestsByPath __tests__/register.test.tsx --colors
```

Para presentar evidencia, amplía la terminal y captura el resultado con Windows + Shift + S. No necesitas el emulador para ejecutar estas pruebas. Los diálogos nativos y el router se sustituyen en las pruebas para observar las alertas y la navegación solicitada; las reglas de validación y el formulario son reales.

Archivos:

- `src/app/register.tsx`: pantalla y navegación.
- `src/utils/validate-register.ts`: reglas de registro; reutiliza las reglas del login.
- `__tests__/register.test.tsx`: 17 pruebas de la pantalla.
- `src/app/_layout.tsx`: declara index y register; mantiene la flecha de regreso.

La práctica valida datos y navega entre pantallas. No guarda cuentas ni conecta a una base de datos.
