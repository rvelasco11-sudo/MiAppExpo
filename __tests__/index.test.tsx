import { Alert } from 'react-native';
import { fireEvent, render, screen } from '@testing-library/react-native';
import Index from '../src/app/index';

const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush }),
}));

const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});

async function enviarFormulario(email: string, password: string) {
  await fireEvent.changeText(screen.getByLabelText('Correo electrónico'), email);
  await fireEvent.changeText(screen.getByLabelText('Contraseña'), password);
  await fireEvent.press(screen.getByRole('button', { name: 'Ingresar' }));
}

function esperarError(message: string) {
  expect(alertSpy).toHaveBeenLastCalledWith('Revisa tus datos', expect.stringContaining(message));
  expect(mockPush).not.toHaveBeenCalled();
}

function esperarExito() {
  expect(mockPush).toHaveBeenLastCalledWith('/home');
  expect(alertSpy).not.toHaveBeenCalled();
}

describe('Index (pantalla de login)', () => {
  beforeEach(async () => {
    await render(<Index />);
  });

  test('muestra imagen, etiquetas, campos y botón', () => {
    expect(screen.getByLabelText('Logotipo de React Native')).toBeOnTheScreen();
    expect(screen.getByLabelText('Correo electrónico')).toBeOnTheScreen();
    expect(screen.getByLabelText('Contraseña')).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Ingresar' })).toBeOnTheScreen();
    expect(alertSpy).not.toHaveBeenCalled();
  });

  test('muestra alerta cuando ambos campos están vacíos', async () => {
    await enviarFormulario('', '');
    esperarError('El correo electrónico no puede estar vacío.');
    esperarError('La contraseña no puede estar vacía.');
  });

  test('muestra alerta cuando solo el correo está vacío', async () => {
    await enviarFormulario('', 'Ejemplo1!');
    expect(alertSpy).toHaveBeenLastCalledWith('Revisa tus datos', 'El correo electrónico no puede estar vacío.');
  });

  test('muestra alerta cuando solo la contraseña está vacía', async () => {
    await enviarFormulario('alumno@example.com', '');
    expect(alertSpy).toHaveBeenLastCalledWith('Revisa tus datos', 'La contraseña no puede estar vacía.');
  });

  test('oculta los caracteres de la contraseña', () => {
    expect(screen.getByLabelText('Contraseña')).toHaveProp('secureTextEntry', true);
  });

  test('usa el teclado de correo electrónico', () => {
    expect(screen.getByLabelText('Correo electrónico')).toHaveProp('keyboardType', 'email-address');
  });

  test('abre register al pulsar Registro sin validar el login', async () => {
    await fireEvent.press(screen.getByRole('button', { name: 'Registro' }));
    expect(mockPush).toHaveBeenCalledWith({ pathname: '/register' });
    expect(alertSpy).not.toHaveBeenCalled();
  });

  describe('Validación del correo', () => {
    test('acepta formatos de correo válidos', async () => {
      for (const email of ['alumno@example.com', 'nombre.apellido@universidad.mx', 'alumno+curso@a.example.com']) {
        await enviarFormulario(email, 'Ejemplo1!');
        esperarExito();
      }
    });

    test('rechaza formatos de correo inválidos', async () => {
      for (const email of ['alumno', 'alumno@example', 'alumno@@example.com', 'al umno@example.com']) {
        await enviarFormulario(email, 'Ejemplo1!');
        esperarError('Ingresa un correo electrónico válido.');
      }
    });
  });

  describe('Validación de la contraseña', () => {
    test('acepta contraseñas válidas', async () => {
      for (const password of ['Ejemplo1!', 'Abcdefg!', 'Ábcdefg!']) {
        await enviarFormulario('alumno@example.com', password);
        esperarExito();
      }
    });

    test('rechaza contraseñas sin mayúsculas', async () => {
      await enviarFormulario('alumno@example.com', 'ejemplo1!');
      esperarError('al menos una mayúscula');
    });

    test('rechaza contraseñas sin minúsculas', async () => {
      await enviarFormulario('alumno@example.com', 'EJEMPLO1!');
      esperarError('al menos una minúscula');
    });

    test('rechaza contraseñas sin caracteres especiales', async () => {
      for (const password of ['Ejemplo12', 'Ejemplo 12']) {
        await enviarFormulario('alumno@example.com', password);
        esperarError('al menos un carácter especial');
      }
    });

    test('rechaza contraseñas con menos de 8 caracteres', async () => {
      await enviarFormulario('alumno@example.com', 'Abcdef!');
      esperarError('al menos 8 caracteres');
    });

    test('rechaza contraseñas con solo números y símbolos', async () => {
      await enviarFormulario('alumno@example.com', '1234567!');
      esperarError('al menos una mayúscula');
      esperarError('al menos una minúscula');
    });
  });
});
