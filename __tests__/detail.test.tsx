import { render, screen, userEvent } from '@testing-library/react-native';
import Detail from '../src/app/detail';

const mockParams = jest.fn();
const mockBack = jest.fn();
const mockReplace = jest.fn();
const mockCanGoBack = jest.fn();
jest.mock('expo-router', () => ({
  useLocalSearchParams: () => mockParams(),
  useRouter: () => ({ back: mockBack, replace: mockReplace, canGoBack: mockCanGoBack }),
}));

describe('Detail (detalle)', () => {
  beforeEach(() => {
    mockParams.mockReturnValue({ name: 'React Native', image: 'file:///react.png' });
    mockCanGoBack.mockReturnValue(true);
  });

  test.each([
    ['React Native', 'file:///react.png'],
    ['Expo', 'https://example.com/expo.png'],
    ['Nombre con acentos: aplicación', 'file:///app.png'],
  ])('muestra el nombre y la imagen recibidos: %s', async (name, image) => {
    mockParams.mockReturnValue({ name, image });
    await render(<Detail />);
    expect(screen.getByText(name)).toBeOnTheScreen();
    expect(screen.getByLabelText(`Imagen de ${name}`)).toHaveProp('source', { uri: image });
  });

  test.each([{}, { image: 'file:///react.png' }, { name: ' ', image: ' ' }])(
    'muestra un aviso si faltan datos: %j', async (params) => {
      mockParams.mockReturnValue(params);
      await render(<Detail />);
      expect(screen.getByText(/No se recibió el nombre del artista/)).toBeOnTheScreen();
      expect(screen.queryByLabelText(/^Imagen de/)).not.toBeOnTheScreen();
    },
  );

  test('muestra el nombre aunque el artista no tenga imagen', async () => {
    mockParams.mockReturnValue({ id: '1', name: 'Muse', image: '' });
    await render(<Detail />);
    expect(screen.getByText('Muse')).toBeOnTheScreen();
    expect(screen.getByLabelText('Imagen no disponible para Muse')).toBeOnTheScreen();
  });

  test('acepta parámetros repetidos usando el primer valor', async () => {
    mockParams.mockReturnValue({ name: ['Expo', 'Otro'], image: ['file:///expo.png', 'file:///otro.png'] });
    await render(<Detail />);
    expect(screen.getByText('Expo')).toBeOnTheScreen();
    expect(screen.getByLabelText('Imagen de Expo')).toHaveProp('source', { uri: 'file:///expo.png' });
  });

  test('vuelve a la pantalla anterior', async () => {
    await render(<Detail />);
    await userEvent.setup().press(screen.getByRole('button', { name: 'Volver al inicio' }));
    expect(mockBack).toHaveBeenCalledTimes(1);
    expect(mockReplace).not.toHaveBeenCalled();
  });

  test('abre inicio si el detalle se abrió sin historial', async () => {
    mockCanGoBack.mockReturnValue(false);
    await render(<Detail />);
    await userEvent.setup().press(screen.getByRole('button', { name: 'Volver al inicio' }));
    expect(mockReplace).toHaveBeenCalledWith('/home');
    expect(mockBack).not.toHaveBeenCalled();
  });
});
