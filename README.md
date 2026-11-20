# MiAppExpo

App de Programación Móvil hecha con Expo y React Native. Incluye formularios de inicio de sesión y registro, una lista de artistas populares de España obtenida de Last.fm y una pantalla de detalle por artista.

## Ejecutar en Android

Desde la raíz del repositorio, instala las dependencias con `npm ci`. Copia `.env.example` como `.env.local` y configura `EXPO_PUBLIC_LASTFM_API_KEY` con una clave de la API de Last.fm. Después abre el emulador de Android y ejecuta:

```bash
npm run android
```

Para probar el acceso, usa `alumno@example.com` y `Ejemplo1!`. Los formularios validan los datos en la app. Al ingresar, selecciona un artista para ver su nombre e imagen.

## Pruebas

```bash
npm test -- --colors
npm run lint
npx tsc --noEmit
```

Las pruebas simulan las consultas a Last.fm y pueden ejecutarse sin una clave ni un emulador.

## Guías

- [R2 · Login y validaciones](PRACTICA-R2.md)
- [R4 · Registro](PRACTICA-R4.md)
- [R5 · Navegación al detalle](PRACTICA-R5.md)
- [R5 · Integración de artistas con Last.fm](PRACTICA-R5-ARTISTAS.md)
