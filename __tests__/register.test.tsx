import { Alert } from 'react-native';
import { fireEvent, render, screen } from '@testing-library/react-native';
import Register from '../src/app/register';

const mockReplace = jest.fn();
const mockBack = jest.fn();
const mockCanGoBack = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({ replace: mockReplace, back: mockBack, canGoBack: mockCanGoBack }),
}));
const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
const validData = ['alumno@example.com', 'rogelio', 'Ejemplo1!', 'Ejemplo1!'];
const labels = ['Correo electrónico', 'Nombre de usuario', 'Contraseña', 'Confirmar contraseña'];

async function enviar(data = validData) {
  // Cambia directamente el texto para probar varias combinaciones del formulario.
  for (let i = 0; i < labels.length; i++) {
    await fireEvent.changeText(screen.getByLabelText(labels[i]), data[i]);
  }
  await fireEvent.press(screen.getByRole('button', { name: 'Registrarse' }));
}

function esperarError(text: string) {
  expect(alertSpy).toHaveBeenLastCalledWith('Revisa tus datos', expect.stringContaining(text));
  expect(mockReplace).not.toHaveBeenCalled();
  expect(mockBack).not.toHaveBeenCalled();
}

describe('Register (pantalla de registro)', () => {
  beforeEach(async () => {
    mockCanGoBack.mockReturnValue(true);
    await render(<Register />);
  });

  test('muestra los cuatro campos y los botones', () => {
    labels.forEach((label) => expect(screen.getByLabelText(label)).toBeOnTheScreen());
    expect(screen.getByRole('button', { name: 'Registrarse' })).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Atrás' })).toBeOnTheScreen();
  });

  test('oculta ambas contraseñas y usa teclado de correo', () => {
    expect(screen.getByLabelText('Contraseña')).toHaveProp('secureTextEntry', true);
    expect(screen.getByLabelText('Confirmar contraseña')).toHaveProp('secureTextEntry', true);
    expect(screen.getByLabelText('Correo electrónico')).toHaveProp('keyboardType', 'email-address');
  });

  test('rechaza todos los campos vacíos', async () => {
    await enviar(['', '', '', '']);
    esperarError('El correo electrónico no puede estar vacío.');
    esperarError('El nombre de usuario no puede estar vacío.');
    esperarError('La contraseña no puede estar vacía.');
    esperarError('La confirmación de contraseña no puede estar vacía.');
  });

  test.each(labels.map((label, index) => [label, index] as const))('rechaza el campo vacío: %s', async (_label, index) => {
    const data = [...validData];
    data[index] = '';
    await enviar(data);
    esperarError(index === 3 ? 'confirmación' : index === 1 ? 'nombre de usuario' : index === 0 ? 'correo electrónico' : 'contraseña');
  });

  test('rechaza un usuario formado solo por espacios', async () => {
    await enviar([validData[0], '   ', validData[2], validData[3]]);
    esperarError('El nombre de usuario no puede estar vacío.');
  });

  test('rechaza correos inválidos', async () => {
    for (const email of ['alumno', 'alumno@example', 'a@@example.com']) {
      await enviar([email, ...validData.slice(1)]);
      esperarError('Ingresa un correo electrónico válido.');
    }
  });

  test.each([
    ['Abcdef!', '8 caracteres'],
    ['ejemplo1!', 'mayúscula'],
    ['EJEMPLO1!', 'minúscula'],
    ['Ejemplo12', 'carácter especial'],
  ])('rechaza la contraseña %s: falta %s', async (password, error) => {
    await enviar([validData[0], validData[1], password, password]);
    esperarError(error);
  });

  test('rechaza contraseñas diferentes', async () => {
    await enviar([validData[0], validData[1], validData[2], 'OtraClave1!']);
    esperarError('Las contraseñas deben coincidir.');
  });

  test('regresa al index cuando todas las validaciones se cumplen', async () => {
    await enviar();
    expect(mockReplace).toHaveBeenCalledWith('/');
    expect(alertSpy).not.toHaveBeenCalled();
  });

  test('Atrás regresa sin exigir llenar los campos', async () => {
    await fireEvent.press(screen.getByRole('button', { name: 'Atrás' }));
    expect(mockBack).toHaveBeenCalledTimes(1);
    expect(mockReplace).not.toHaveBeenCalled();
    expect(alertSpy).not.toHaveBeenCalled();
  });

  test('Atrás abre index si no existe una pantalla anterior', async () => {
    mockCanGoBack.mockReturnValue(false);
    await fireEvent.press(screen.getByRole('button', { name: 'Atrás' }));
    expect(mockReplace).toHaveBeenCalledWith('/');
    expect(mockBack).not.toHaveBeenCalled();
  });
});
