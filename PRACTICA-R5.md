# Práctica R5: app con detail

## Recorrido para mostrar al maestro

1. Desde MiAppExpo, ejecuta `npm run android` si Expo no está abierto.
2. En el login escribe `alumno@example.com` y `Ejemplo1!`, y pulsa Ingresar.
3. Se abre Inicio, con tres elementos de ejemplo que usan imágenes del proyecto.
4. Pulsa React Native, Expo o Mi aplicación.
5. Se abre Detalle con la imagen y el nombre del elemento elegido.
6. Pulsa Volver al inicio o la flecha del encabezado. Selecciona otro elemento y comprueba que cambian el nombre y la imagen.

En esta R5, los datos válidos del login abren Inicio en lugar de mostrar la alerta de éxito de la práctica anterior. Los datos inválidos siguen mostrando una alerta. El registro sigue regresando al login al completar sus validaciones.

## Cómo se pasan los datos

`src/app/home.tsx` abre `/detail` con los parámetros `name` e `image`. El nombre viene del elemento seleccionado y la imagen es la URI de su recurso local, obtenida con `Image.resolveAssetSource`.

`src/app/detail.tsx` recibe los valores con `useLocalSearchParams`. Usa `name` en el título y `image` como fuente de la imagen grande. Si faltan datos muestra un aviso y permite volver a Inicio.

`src/app/_layout.tsx` declara las cuatro pantallas: index, register, home y detail, con sus encabezados sencillos.

## Pruebas

Abre una terminal en MiAppExpo:

```powershell
npm.cmd test -- --colors
```

Resultado verificado para esta versión:

```text
Test Suites: 4 passed, 4 total
Tests:       46 passed, 46 total
```

Cada archivo de pantalla nuevo tiene su archivo de pruebas:

| Archivo nuevo | Pruebas |
| --- | --- |
| src/app/home.tsx | __tests__/home.test.tsx |
| src/app/detail.tsx | __tests__/detail.test.tsx |

Las pruebas de login se actualizaron para verificar que los datos válidos abren Inicio y que los inválidos no navegan. Se mantienen también las pruebas de registro.

Para ejecutar solo las dos pantallas nuevas:

```powershell
npm.cmd test -- --runTestsByPath __tests__/home.test.tsx __tests__/detail.test.tsx --colors
```

Se comprueban la lista, el envío de los parámetros del elemento seleccionado, el nombre y la fuente de imagen recibidos, los datos faltantes y el regreso. Las pruebas sustituyen el router y la resolución nativa de imágenes para comprobar sus argumentos; la presentación visual se verifica en el emulador.

Otras comprobaciones: `npx tsc --noEmit` y `npm run lint`.

Para la evidencia, amplía la terminal y toma una captura con Windows + Shift + S. Toma también capturas de dos detalles distintos en el emulador.
