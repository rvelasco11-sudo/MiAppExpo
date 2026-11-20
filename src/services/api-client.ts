import type { Artist, ArtistResource } from "@/types/artist";

// Endpoint de lectura del ejemplo del maestro. La clave se configura en .env.local.
const URL = "https://ws.audioscrobbler.com/2.0/";

export async function getMusicData(signal?: AbortSignal): Promise<Artist[]> {
  const apiKey = process.env.EXPO_PUBLIC_LASTFM_API_KEY?.trim();
  if (!apiKey) throw new Error("Falta configurar la clave de Last.fm en .env.local.");

  const query = `method=geo.gettopartists&country=spain&api_key=${encodeURIComponent(apiKey)}&format=json&limit=30`;
  let response: Response;
  try {
    response = await fetch(`${URL}?${query}`, { method: "GET", headers: { Accept: "application/json" }, signal });
  } catch (error) {
    if (signal?.aborted) throw error;
    throw new Error("No se pudo conectar con Last.fm. Revisa tu conexión.");
  }
  if (!response.ok) throw new Error(`No se pudieron cargar los artistas (HTTP ${response.status}).`);

  let data: { error?: number; message?: string; topartists?: { artist?: ArtistResource[] } };
  try {
    data = await response.json();
  } catch {
    throw new Error("Last.fm devolvió una respuesta inválida.");
  }
  if (!data || typeof data !== "object") throw new Error("Last.fm devolvió una respuesta inválida.");
  if (data.error) throw new Error(`Last.fm: ${data.message || "No se pudo completar la consulta."}`);
  if (!Array.isArray(data.topartists?.artist)) throw new Error("Last.fm devolvió una lista de artistas inválida.");

  return data.topartists.artist.map((artist) => {
    if (!artist || typeof artist.name !== "string" || !artist.name.trim()) {
      throw new Error("Last.fm devolvió un artista sin nombre.");
    }
    const name = artist.name.trim();
    // Prefiere la versión grande. Algunos artistas no tienen MBID o imagen.
    const images = Array.isArray(artist.image) ? artist.image : [];
    const image = [...images].reverse().find((item) => typeof item?.["#text"] === "string" && item["#text"].trim());
    return {
      id: artist.mbid?.trim() || name,
      name,
      image: image?.["#text"].trim() || "",
    };
  });
}
