const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const axios = require("axios").default;

// Función para validar si la ruta existe
const existPath = (paths) => fs.existsSync(paths); 

// Función para validar si es un directorio
const validateDirectory = (paths) => fs.statSync(paths).isDirectory();

// Función para validar si el archivo es .md y su extención
const existMdFile = (paths) => path.extname(paths) === ".md";

//Función para convertir la ruta a absoluta
const convertToAbsolute = (paths) => path.resolve(paths);

// Función para leer los archivos que están dentro de un directorio
function getAllFilesDirectory(path) {
  if (validateDirectory(path)) {
    const files = fs.readdirSync(path);
    const resultFiles =  files
      .map((file) => {
        return getAllFilesDirectory(`${path}/${file}`);
      })
      .flat();
    return resultFiles;
  } else {
    return [path];
  }
}
// Función que se encarga de validar el array de los archivos .md encontrados
const analyzeMdFilesArray = (mdFilesArray) => {
  const backupArray = [];
  return new Promise((resolve, reject) => {
    mdFilesArray.forEach((file, index) => {
      fs.readFile(`${file}`, "utf-8", (err, content) => {
        if (err) {
          reject(
            chalk.bgRed.bold("---------- ERROR: Analyze .md Files ----------")
          );
        } else {
          backupArray.push(getLinksDocument(file, content));
          const merge = [].concat(...backupArray);
          if (index === mdFilesArray.length - 1) {
            resolve(merge);
          }
        }
      });
    });
  });
};

//Función para obtener los resultados de las opción Stats
const getStatsResult = (arrayObject) => {
  const arrayLink = arrayObject.map((element) => element.href);
  const uniqueLink = new Set(arrayLink);
  return {
    Total: arrayLink.length,
    Unique: uniqueLink.size,
  };
};

// Función que permite obtener los resultados
const getResultValidateStats = (arrayObject) => {
  const arrayLink = arrayObject.map((element) => element.href);
  const uniqueLink = new Set(arrayLink);
  const brokenLink = arrayObject.filter((element) => element.ok === "fail");
  return {
    Total: arrayLink.length,
    Unique: uniqueLink.size,
    Broken: brokenLink.length,
  };
};

const linksRegex =
  /\[(.+?)\]\((https?:\/\/[^\s]+)(?: "(.+)")?\)|(https?:\/\/[^\s]+)/gi;
const urlRegex = /\((https?:\/\/[^\s]+)(?: "(.+)")?\)|(https?:\/\/[^\s]+)/gi;
const textRegex = /\[(\w+.+?)\]/gi;

//Función que permite obtener los links del documento MD
const getLinksDocument = (file, content) => {
  const arrayResponse = [];
  if (!linksRegex.test(content)) {
    //valida las coincidencias con respecto a la expresión regular de texto
    console.log(
      chalk.bgRed.bold(
        "---------- ERROR: Dont exist Links on the path " +
          `${file}` +
          " ----------"
      )
    );
    return [];
  } else {
    const matches = content.match(linksRegex); // Obtiene las coincidencias de las expresiones regulares
    matches.forEach((item) => {
      const matchestext = item.match(textRegex);
      let unitText = "";
      let originText = ["No text"];
      if (matchestext) {
        unitText = matchestext[0];
        originText = unitText.replace(/\[|\]/g, "").split(",");
      }
      const matchesLink = item.match(urlRegex);
      const unitLink = matchesLink[0];
      const originLink = unitLink.replace(/\(|\)/g, "").split(",");

      arrayResponse.push({
        href: originLink[0],
        text: originText[0],
        path: `${file}`,
      });
    });

    return arrayResponse;
  }
};

// validación de los links - entrega el array de objetos con status y ok
const getHttpResponse = (mdFilesArrayLink) => {
  const validate = mdFilesArrayLink.map((link) => {
    return axios
      .get(link.href)
      .then((result) => {
        const responseValidate = {
          ...link,
          status: result.status,
          ok: result.statusText,
        };
        return responseValidate;
      })
      .catch((err) => {
        const responseValidate = {
          ...link,
          status: err.response ? 404 : "ERROR",
          ok: "fail",
        };
        return responseValidate;
      });
  });
  return Promise.all(validate);
};

module.exports = {
  existPath,
  existMdFile,
  convertToAbsolute,
  validateDirectory,
  getResultValidateStats,
  getAllFilesDirectory,
  analyzeMdFilesArray,
  getHttpResponse,
  getStatsResult,
  getLinksDocument,
};