const { 
  existPath, 
  existMdFile, 
  convertToAbsolute, 
  getAllFilesDirectory, 
  validateDirectory, 
  analyzeMdFilesArray,
  getStatsResult,
  getResultValidateStats,
  getLinksDocument,
  getHttpResponse } = require("../functions.js");

// Method process.cwd = current working directory
const currentDir = `${process.cwd()}`;

describe("existPath", () => {
  it("Debe ser una función", () => {
    expect(typeof existPath).toBe("function");
  });
  it("Debe validar cuando el path existe", () => {
    existPath("testeo/testeo1.md");
    expect(existPath("testeo/testeo1.md")).toEqual(true);
  });
  it("Debe validar cuando el path no existe", () => {
    existPath("./aqui/falla.md");
    expect(existPath("./aqui/falla.md")).toEqual(false);
  });
});

// Test para validar si es archivo es tipo .md
describe("existMdFile", () => {
  it("Debe ser una función", () => {
    expect(typeof existMdFile).toBe("function");
  });
  it("Debe devolver true si el archivo es tipo .md", () => {
    existMdFile("./README.md");
    expect(existMdFile("./README.md")).toEqual(true);
  });
  it("Debe devolver false si el archivo no es tipo .md", () => {
    existMdFile("./README.md");
    expect(existMdFile("./package.json")).toEqual(false);
  });
});

// Test validacion si la ruta es absoluta o relativa
describe('convertToAbsolute', () => {
  it('Debe cambiar la ruta a absoluta si es relativa', () => {
    convertToAbsolute(`${currentDir}\\README.md`);
    expect(convertToAbsolute(`${currentDir}\\README.md`)).toBe(`${currentDir}\\README.md`);
  });
});

// Test para validar si es un directorio
describe("validateDirectory", () => {
  it("Debe ser una función", () => {
    expect(typeof validateDirectory).toBe("function");
  });
  it('Debe validar si la ruta es directorio', () => {
    validateDirectory('./testeo');
    expect(validateDirectory('./testeo'))
  })
});

// Test para leer los archivos
describe("getAllFilesDirectory", () => {
  it('Debe devolver los archivos del directorio', () => {
    expect(getAllFilesDirectory('./testeo'))
    .toEqual([ "./testeo/subTest/hayLinks.md", "./testeo/subTest/noHayLinks.md","./testeo/testeo1.md", "./testeo/testeo2.js"])
  });
});

// Test para recorrer el array
const arrayObjects = [
  {
    href: 'https://curriculum.laboratoria/',
    text: 'Funciones (control de flujo)',
    path: './testeo/testeo1.md'
  },
  {
    href: 'https://curriculum.laboratoria.la/es/topics/javascript/03-functions/01-classic',
    text: 'Funciones clásicas',
    path: './testeo/testeo1.md'
  },
  {
    href: 'https://curriculum.laboratoria.la/es/topics/javascript/03-functions/02-arrow',
    text: 'Arrow Functions',
    path: './testeo/testeo1.md'
  },
  {
    href: 'https://developer.mozilla.org/es/docs/Learn/JavaScript/Building_blocks/Functions',
    text: 'Funciones — bloques de código reutilizables - MDN',
    path: './testeo/testeo1.md'
  }
];

describe('analyzeMdFilesArray, entrega el array de objetos luego de leer cada archivo', () => {
  it('debe ser una función', () => {
    expect(typeof analyzeMdFilesArray).toBe('function')
  });
  it('retorna una promesa', () => {
    expect(typeof analyzeMdFilesArray([]).then).toBe('function')
  });
  it('retorna un array de objetos', () => {
    expect(analyzeMdFilesArray(['./testeo/testeo1.md'])).resolves.toEqual(arrayObjects)
  });
});

// Test para obtener los links .md
const content = `
[Funciones (control de flujo)](https://curriculum.laboratoria/)
[Funciones clásicas](https://curriculum.laboratoria.la/es/topics/javascript/03-functions/01-classic)
[Arrow Functions](https://curriculum.laboratoria.la/es/topics/javascript/03-functions/02-arrow)
[Funciones — bloques de código reutilizables - MDN](https://developer.mozilla.org/es/docs/Learn/JavaScript/Building_blocks/Functions)`

describe('getLinksDocument, entrega el array de objetos luego de hacer match con los links', () => {
  it('debe ser una función', () => {
    expect(typeof getLinksDocument).toBe('function')
  });
  it('retorna un array de objetos', () => {
    expect(getLinksDocument('./testeo/testeo1.md', content)).toEqual(arrayObjects)
  });
});

// Test para validar --validate
const validateObjects = [
  {
    href: 'https://curriculum.laboratoria/',
    text: 'Funciones (control de flujo)',
    path: './testeo/testeo1.md',
    status: 'ERROR',
    ok: 'fail'
  },
  {
    href: 'https://curriculum.laboratoria.la/es/topics/javascript/03-functions/01-classic',
    text: 'Funciones clásicas',
    path: './testeo/testeo1.md',
    status: 200,
    ok: 'OK'
  },
  {
    href: 'https://curriculum.laboratoria.la/es/topics/javascript/03-functions/02-arrow',
    text: 'Arrow Functions',
    path: './testeo/testeo1.md',
    status: 200,
    ok: 'OK'
  },
  {
    href: 'https://developer.mozilla.org/es/docs/Learn/JavaScript/Building_blocks/Functions',
    text: 'Funciones — bloques de código reutilizables - MDN',
    path: './testeo/testeo1.md',
    status: 404,
    ok: 'fail'
  }
]
describe('getHttpResponse, entrega el array de objetos sumando el status y statustext', () => {
  it('debe ser una función', () => {
    expect(typeof getHttpResponse).toBe('function')
  });
  it('retorna una promesa', () => {
    expect(typeof getHttpResponse([]).then).toBe('function')
  });
  it('retorna un array de objetos', () => {
    expect(getHttpResponse(arrayObjects)).resolves.toEqual(validateObjects)
  });
});

// Test para validar --stats
describe('getStatsResult, entrega un objeto con dos propiedades total y unique', () => {
  it('debe ser una función', () => {
    expect(typeof getStatsResult).toBe('function')
  });
  it('retorna un objeto con dos propiedades', () => {
    expect(getStatsResult([arrayObjects])).toEqual({Total: 1, Unique: 1})
  });
});

// Test para validar --Validate --stats
describe('getResultValidateStats, entrega un objeto con tres propiedadess total, unique, broken', () => {
  it('debe ser una función', () => {
    expect(typeof getResultValidateStats).toBe('function')
  });
  it('retorna un objeto con tres propiedades', () => {
    expect(getResultValidateStats([arrayObjects])).toEqual({Total: 1, Unique: 1, Broken: 0})
  });
});