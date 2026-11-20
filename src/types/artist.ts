export interface Artist {
  id: string;
  name: string;
  image: string;
}

export interface ImageUrl {
  "#text": string;
  size?: string;
}

export interface ArtistResource {
  name: string;
  mbid?: string;
  image?: ImageUrl[];
}
