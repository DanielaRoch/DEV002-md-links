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
    .toEqual(["./testeo/testeo1.md", "./testeo/testeo2.js", "./testeo/subTest/hayLinks.md", "./testeo/subTest/noHayLinks.md", ])
  });
});