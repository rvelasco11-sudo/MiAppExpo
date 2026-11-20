import { act, render, screen, userEvent } from '@testing-library/react-native';
import Home from '../src/app/home';
import { getMusicData } from '../src/services/api-client';
import type { Artist } from '../src/types/artist';

jest.mock('../src/services/api-client');
const mockGetMusicData = getMusicData as jest.MockedFunction<typeof getMusicData>;
const mockPush = jest.fn();
jest.mock('expo-router', () => ({ useRouter: () => ({ push: mockPush }) }));
const artists = [{ id: '1', name: 'Coldplay', image: 'https://example.com/coldplay.png' }];

describe('Home (artistas del endpoint)', () => {
  beforeEach(() => { mockGetMusicData.mockReset(); mockGetMusicData.mockResolvedValue(artists); });
  afterEach(() => { jest.useRealTimers(); });

  test('muestra un indicador mientras espera al endpoint', async () => {
    mockGetMusicData.mockReturnValue(new Promise<Artist[]>(() => {}));
    await render(<Home />);
    expect(screen.getByLabelText('Cargando artistas')).toBeOnTheScreen();
  });
  test('muestra los artistas reales devueltos por el cliente', async () => {
    await render(<Home />);
    expect(await screen.findByText('Coldplay')).toBeOnTheScreen();
    expect(screen.queryByLabelText('Cargando artistas')).not.toBeOnTheScreen();
  });
  test('abre el detalle del artista seleccionado con todos sus datos', async () => {
    await render(<Home />);
    await userEvent.setup().press(await screen.findByRole('button', { name: 'Ver detalle de Coldplay' }));
    expect(mockPush).toHaveBeenCalledWith({ pathname: '/detail', params: artists[0] });
  });
  test('muestra el error y permite reintentar', async () => {
    mockGetMusicData.mockRejectedValueOnce(new Error('Sin conexión'));
    await render(<Home />);
    expect(await screen.findByText('Sin conexión')).toBeOnTheScreen();
    await userEvent.setup().press(screen.getByRole('button', { name: 'Reintentar' }));
    expect(await screen.findByText('Coldplay')).toBeOnTheScreen();
    expect(mockGetMusicData).toHaveBeenCalledTimes(2);
  });
  test('muestra un mensaje cuando la lista está vacía', async () => {
    mockGetMusicData.mockResolvedValue([]);
    await render(<Home />);
    expect(await screen.findByText('No hay artistas disponibles.')).toBeOnTheScreen();
  });
  test('cancela la solicitud al salir de la pantalla', async () => {
    mockGetMusicData.mockReturnValue(new Promise<Artist[]>(() => {}));
    const view = await render(<Home />);
    const signal = mockGetMusicData.mock.calls[0][0];
    await view.unmount();
    expect(signal?.aborted).toBe(true);
  });
  test('deja de cargar y muestra aviso si la consulta supera 15 segundos', async () => {
    jest.useFakeTimers();
    mockGetMusicData.mockImplementation((signal) => new Promise((_resolve, reject) => {
      signal?.addEventListener('abort', () => reject(new Error('abort')));
    }));
    await render(<Home />);
    await act(async () => { jest.advanceTimersByTime(15000); });
    expect(screen.getByText('La consulta tardó demasiado. Vuelve a intentarlo.')).toBeOnTheScreen();
  });
});
