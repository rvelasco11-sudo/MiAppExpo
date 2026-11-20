import { render, screen, userEvent } from '@testing-library/react-native';
import ArtistList from '../src/components/ArtistList';
const mockPush = jest.fn();
jest.mock('expo-router', () => ({ useRouter: () => ({ push: mockPush }) }));
const artists = [
  { id: 'coldplay-id', name: 'Coldplay', image: 'https://example.com/coldplay.png' },
  { id: 'muse-id', name: 'Muse', image: '' },
];

describe('ArtistList', () => {
  test('muestra todos los artistas recibidos', async () => {
    await render(<ArtistList artists={artists} />);
    for (const artist of artists) expect(screen.getByRole('button', { name: `Ver detalle de ${artist.name}` })).toBeOnTheScreen();
  });
  test.each(artists)('envía id, name e image de $name a detail', async (artist) => {
    await render(<ArtistList artists={artists} />);
    await userEvent.setup().press(screen.getByRole('button', { name: `Ver detalle de ${artist.name}` }));
    expect(mockPush).toHaveBeenCalledWith({ pathname: '/detail', params: artist });
  });
  test('avisa si no hay artistas', async () => {
    await render(<ArtistList artists={[]} />);
    expect(screen.getByText('No hay artistas disponibles.')).toBeOnTheScreen();
  });
});
