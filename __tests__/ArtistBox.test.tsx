import { fireEvent, render, screen } from '@testing-library/react-native';
import ArtistBox from '../src/components/ArtistBox';
const artist = { id: '1', name: 'Coldplay', image: 'https://example.com/artist.png' };

describe('ArtistBox', () => {
  test('muestra el nombre y la imagen del artista', async () => {
    await render(<ArtistBox artist={artist} />);
    expect(screen.getByText('Coldplay')).toBeOnTheScreen();
    expect(screen.getByLabelText('Imagen de Coldplay')).toHaveProp('source', { uri: artist.image });
  });
  test('muestra el artista aunque no tenga imagen', async () => {
    await render(<ArtistBox artist={{ ...artist, image: '' }} />);
    expect(screen.getByLabelText('Imagen no disponible para Coldplay')).toBeOnTheScreen();
    expect(screen.getByText('Coldplay')).toBeOnTheScreen();
  });
  test('sustituye una imagen que no carga', async () => {
    await render(<ArtistBox artist={artist} />);
    await fireEvent(screen.getByLabelText('Imagen de Coldplay'), 'error', { nativeEvent: { error: '404' } });
    expect(screen.getByLabelText('Imagen no disponible para Coldplay')).toBeOnTheScreen();
  });
  test('intenta cargar la imagen si cambia el artista', async () => {
    const view = await render(<ArtistBox artist={artist} />);
    await fireEvent(screen.getByLabelText('Imagen de Coldplay'), 'error', {});
    await view.rerender(<ArtistBox artist={{ id: '2', name: 'Muse', image: 'https://example.com/muse.png' }} />);
    expect(screen.getByLabelText('Imagen de Muse')).toBeOnTheScreen();
  });
  test('el modo detalle muestra la imagen grande', async () => {
    await render(<ArtistBox artist={artist} large />);
    expect(screen.getByLabelText('Imagen de Coldplay')).toHaveStyle({ height: 240 });
    expect(screen.queryByText('Ver detalle →')).not.toBeOnTheScreen();
  });
});
