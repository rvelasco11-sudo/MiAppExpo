# R5: artistas desde Last.fm

## Flujo

1. Abre la app con `npm run android` (si el servidor ya está abierto, usa esa sesión).
2. Entra con `alumno@example.com` y `Ejemplo1!`.
3. Inicio consulta los artistas populares de España usando Last.fm.
4. Pulsa un artista para abrir su detalle. Se envían `id`, `name` e `image`.
5. Usa la flecha o Volver al inicio para regresar a la lista.

## Archivos del ejemplo del maestro

| Archivo | Función | Archivo de pruebas |
| --- | --- | --- |
| src/types/artist.ts | Contratos Artist, ArtistResource e ImageUrl | __tests__/artist.test.tsx |
| src/services/api-client.ts | GET del endpoint y transformación a Artist[] | __tests__/api-client.test.tsx |
| src/components/ArtistBox.tsx | Nombre e imagen del artista, en lista o detalle | __tests__/ArtistBox.test.tsx |
| src/components/ArtistList.tsx | FlatList y navegación al pulsar un artista | __tests__/ArtistList.test.tsx |
| src/app/home.tsx | Carga, errores, reintento y lista | __tests__/home.test.tsx |
| src/app/detail.tsx | Recibe parámetros y muestra ArtistBox | __tests__/detail.test.tsx |

Los componentes y el cliente viven fuera de src/app para que Expo Router no los interprete como pantallas.

## Endpoint

Se consume el endpoint externo del ejemplo:

```text
GET https://ws.audioscrobbler.com/2.0/?method=geo.gettopartists&country=spain&api_key=TU_CLAVE&format=json&limit=30
```

No se necesita crear un servidor local. La respuesta `topartists.artist` se transforma en una lista de objetos `{ id, name, image }`.

Correcciones sobre las capturas:

- HTTPS en lugar de HTTP.
- `id` es string porque se toma de `mbid`. Si falta mbid se usa el nombre.
- `image` en ArtistResource es un arreglo, no una tupla de un solo elemento.
- Se elige la última imagen no vacía para aprovechar el tamaño grande.
- Se comprueban errores HTTP y errores de Last.fm, incluso cuando HTTP es 200.
- La lista permite navegar aunque un artista no tenga imagen.
- La consulta se cancela al salir de Inicio y muestra un aviso si tarda más de 15 segundos.

La clave autorizada del ejemplo está configurada en `.env.local`, que Git ignora. En otra computadora copia `.env.example` a `.env.local` y coloca la clave. Es una clave de cliente EXPO_PUBLIC y se incluye en la app; no colocar aquí un secreto de cuenta. Si cambias la configuración, recarga la app; si Expo ya estaba abierto antes de crear el archivo, reinicia el servidor.

La consulta real comprobada devolvió imágenes genéricas idénticas para varios artistas. La app muestra lo que entrega Last.fm; no inventa fotografías. Si falta una imagen o falla la descarga, muestra un marcador Sin imagen.

## Pruebas para el maestro

En Símbolo del sistema (CMD):

```cmd
cd /d "D:\5to semestre\Programación movil\MiAppExpo"
npm.cmd test -- --colors
```

Resultado: 8 suites aprobadas y 74 pruebas aprobadas. Las pruebas del endpoint simulan fetch; no consumen la cuota de Last.fm. Se comprueban también carga, reintento, errores HTTP, errores de la API, datos faltantes, la imagen y la navegación.

Para revisar solo el endpoint y los componentes:

```cmd
npm.cmd test -- --runTestsByPath __tests__/api-client.test.tsx __tests__/artist.test.tsx __tests__/ArtistBox.test.tsx __tests__/ArtistList.test.tsx --colors
```

También se ejecutan `npx tsc --noEmit` y `npm run lint`.

Documentación: https://www.last.fm/pt/api/show/geo.getTopArtists y https://docs.expo.dev/guides/environment-variables/
