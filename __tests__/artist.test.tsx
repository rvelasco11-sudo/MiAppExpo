import type { Artist, ArtistResource } from '../src/types/artist';

// Estos contratos también se comprueban con tsc --noEmit.
const artist: Artist = { id: 'mbid-de-texto', name: 'Coldplay', image: 'https://example.com/image.png' };
const resource: ArtistResource = {
  name: 'Coldplay', mbid: artist.id,
  image: [{ '#text': 'small.png', size: 'small' }, { '#text': 'large.png', size: 'large' }],
};

test('el contrato admite identificadores de texto y varios tamaños de imagen', () => {
  expect(resource.mbid).toBe(artist.id);
  expect(resource.image).toHaveLength(2);
});
