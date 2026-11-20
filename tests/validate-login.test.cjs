const { test } = require('node:test');
const assert = require('node:assert/strict');
const ts = require('typescript');
const fs = require('node:fs');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname, '../src/utils/validate-login.ts'), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
const validation = { exports: {} };
new Function('exports', compiled)(validation.exports);
const { validateLogin } = validation.exports;
const validEmail = 'alumno@example.com';
const validPassword = 'Ejemplo1!';
const cases = [
  ['datos válidos', validEmail, validPassword, []],
  ['correo vacío', '', validPassword, ['vacío']],
  ['contraseña vacía', validEmail, '', ['vacía']],
  ['ambos vacíos', '', '', ['vacío', 'vacía']],
  ['solo espacios', '  ', '  ', ['vacío', 'vacía']],
  ['sin arroba', 'alumno.example.com', validPassword, ['correo electrónico válido']],
  ['sin dominio completo', 'alumno@example', validPassword, ['correo electrónico válido']],
  ['doble arroba', 'alumno@@example.com', validPassword, ['correo electrónico válido']],
  ['correo con espacios internos', 'al umno@example.com', validPassword, ['correo electrónico válido']],
  ['correo con subdominio', 'alumno+curso@a.example.com', validPassword, []],
  ['espacios exteriores del correo', ' alumno@example.com ', validPassword, []],
  ['menos de ocho caracteres', validEmail, 'Abcdef!', ['8 caracteres']],
  ['sin mayúscula', validEmail, 'ejemplo1!', ['mayúscula']],
  ['sin minúscula', validEmail, 'EJEMPLO1!', ['minúscula']],
  ['sin símbolo', validEmail, 'Ejemplo12', ['carácter especial']],
  ['espacio no cuenta como símbolo', validEmail, 'Ejemplo 12', ['carácter especial']],
  ['ocho caracteres exactos', validEmail, 'Abcdefg!', []],
  ['letras acentuadas', validEmail, 'Ábcdefg!', []],
];
for (const [name, email, password, expected] of cases) {
  test(name, () => {
    const errors = validateLogin(email, password);
    assert.equal(errors.length, expected.length);
    expected.forEach((text) => assert.ok(errors.some((error) => error.includes(text))));
  });
}
