import { getMusicData } from '../src/services/api-client';

const mockFetch = jest.fn();
const originalFetch = global.fetch;
const originalKey = process.env.EXPO_PUBLIC_LASTFM_API_KEY;
const resource = {
  name: 'Coldplay', mbid: 'coldplay-id',
  image: [{ '#text': 'https://example.com/small.png' }, { '#text': 'https://example.com/large.png' }],
};
function responder(body: unknown, ok = true, status = 200) {
  mockFetch.mockResolvedValue({ ok, status, json: async () => body });
}

describe('api-client (endpoint de artistas)', () => {
  beforeEach(() => {
    global.fetch = mockFetch;
    mockFetch.mockReset();
    process.env.EXPO_PUBLIC_LASTFM_API_KEY = 'clave-de-prueba';
    responder({ topartists: { artist: [resource] } });
  });
  afterAll(() => {
    global.fetch = originalFetch;
    if (originalKey === undefined) delete process.env.EXPO_PUBLIC_LASTFM_API_KEY;
    else process.env.EXPO_PUBLIC_LASTFM_API_KEY = originalKey;
  });

  test('consulta por HTTPS geo.gettopartists para España y propaga la señal', async () => {
    const controller = new AbortController();
    await getMusicData(controller.signal);
    const [url, options] = mockFetch.mock.calls[0];
    expect(url).toMatch(/^https:\/\/ws\.audioscrobbler\.com\/2\.0\//);
    expect(url).toContain('method=geo.gettopartists');
    expect(url).toContain('country=spain');
    expect(url).toContain('api_key=clave-de-prueba');
    expect(options).toEqual({ method: 'GET', headers: { Accept: 'application/json' }, signal: controller.signal });
  });
  test('transforma el artista y elige la imagen grande', async () => {
    expect(await getMusicData()).toEqual([{ id: 'coldplay-id', name: 'Coldplay', image: 'https://example.com/large.png' }]);
  });
  test('usa el nombre como identificador si falta mbid y admite imagen vacía', async () => {
    responder({ topartists: { artist: [{ name: 'Sin MBID', mbid: '', image: [] }] } });
    expect(await getMusicData()).toEqual([{ id: 'Sin MBID', name: 'Sin MBID', image: '' }]);
  });
  test('ignora tamaños vacíos al elegir imagen', async () => {
    responder({ topartists: { artist: [{ ...resource, image: [{ '#text': 'https://example.com/ok.png' }, { '#text': '' }] }] } });
    expect((await getMusicData())[0].image).toBe('https://example.com/ok.png');
  });
  test('admite una lista vacía', async () => {
    responder({ topartists: { artist: [] } });
    expect(await getMusicData()).toEqual([]);
  });
  test('no consulta si falta la clave', async () => {
    delete process.env.EXPO_PUBLIC_LASTFM_API_KEY;
    await expect(getMusicData()).rejects.toThrow('Falta configurar');
    expect(mockFetch).not.toHaveBeenCalled();
  });
  test('codifica los caracteres de la clave', async () => {
    process.env.EXPO_PUBLIC_LASTFM_API_KEY = 'clave&extra';
    await getMusicData();
    expect(mockFetch.mock.calls[0][0]).toContain('api_key=clave%26extra');
  });
  test('reporta errores HTTP', async () => {
    responder({}, false, 503);
    await expect(getMusicData()).rejects.toThrow('HTTP 503');
  });
  test('reporta errores de Last.fm aunque el HTTP sea 200', async () => {
    responder({ error: 10, message: 'Invalid API key' });
    await expect(getMusicData()).rejects.toThrow('Last.fm: Invalid API key');
  });
  test.each([{}, null, { topartists: { artist: {} } }])('rechaza una respuesta mal formada: %j', async (data) => {
    responder(data);
    await expect(getMusicData()).rejects.toThrow(/inválida/);
  });
  test('rechaza JSON ilegible', async () => {
    mockFetch.mockResolvedValue({ ok: true, json: async () => { throw new Error('JSON'); } });
    await expect(getMusicData()).rejects.toThrow('respuesta inválida');
  });
  test('rechaza un artista sin nombre', async () => {
    responder({ topartists: { artist: [{ name: ' ' }] } });
    await expect(getMusicData()).rejects.toThrow('sin nombre');
  });
  test('reporta fallos de red', async () => {
    mockFetch.mockRejectedValue(new TypeError('Network request failed'));
    await expect(getMusicData()).rejects.toThrow('Revisa tu conexión');
  });
});
