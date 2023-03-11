const {
  existPath,
  existMdFile,
  convertToAbsolute,
  getResultValidateStats,
  validateDirectory,
  getAllFilesDirectory,
  analyzeMdFilesArray,
  getHttpResponse,
  getStatsResult,
} = require("./functions.js");

const chalk = require("chalk");

const mdLinks = (path, options) => {
  return new Promise((resolve) => {
    let mdFilesArray = [];
    if (existPath(path)) {
      console.log(
        chalk.bgGreen.bold("-- RESULT: The path exist --")
      );
      const absolutePath = convertToAbsolute(path); // Se convierte path a absolute
      if (validateDirectory(absolutePath)) {
        // valida que el path sea de un directorio (carpeta)
        getAllFilesDirectory(absolutePath).forEach((file) => {
          // getAllFilesDirectory obtiene los archivos que hay dentro del directorio
          if (existMdFile(file)) {
            // valida archivo por archivo para saber si es o no .MD
            mdFilesArray.push(file); // En caso de encontrarlo lo almacena en un array
          } else {
            console.log(
              chalk.bgYellow.bold(
                `-- RESULT: no file type .md ${file}--`
              )
            );
          }
        });
      } else {
        // Si no es un directorio, si no un archivo especifico
        if (existMdFile(absolutePath)) {
          mdFilesArray.push(absolutePath);
        } else {
          console.log(
            chalk.bgYellow.bold(
              `-- RESULT: no file type .md ${absolutePath}--`
            )
          );
        }
      }
      // Cuando el array esta vacio (No encuentra archivos .md)
      if (mdFilesArray.length === 0) {
        console.log(
          chalk.bgRed.bold("-- RESULT: no .md files --")
        );
      }
      //En esta sección comienza a validar los parámetros enviados: *--validate* y *--stats*
      //Condicional para realizar el proceso de Validate y Stats ()
      if (options.validate === true && options.stats === true) {
        analyzeMdFilesArray(mdFilesArray).then((result) => {
          getHttpResponse(result).then((result) => {
            const resultValidateAndStats = getResultValidateStats(result);
            console.log(
              chalk.bgGreen.bold(
                "---------- Result Analysis Validate and Stats ----------"
              )
            );
            console.log(resultValidateAndStats);
            resolve(resultValidateAndStats);
          });
        });
        //Condicional para realizar el proceso de Validate
      } else if (options.validate === true && options.stats === false) {
        analyzeMdFilesArray(mdFilesArray).then((result) => {
          getHttpResponse(result).then((result) => {
            const validateLink = result;
            resolve(validateLink);
            console.log(
              chalk.bgGreen.bold(
                "---------- Result Analysis Validate ----------"
              )
            );
            console.log(validateLink);
          });
        });
        //Condicional para realizar el proceso de Stats
      } else if (options.stats === true && options.validate === false) {
        analyzeMdFilesArray(mdFilesArray).then((result) => {
          const valueStats = getStatsResult(result);
          console.log(
            chalk.bgGreen.bold("---------- Result Analysis Stats ----------")
          );
          console.log(valueStats);
          resolve(valueStats);
        });
        // Acá ingresa cuando no se tienen agregadas las banderas
      } else {
        analyzeMdFilesArray(mdFilesArray).then((result) => {
          const noOptions = result;
          resolve(noOptions);
          console.log(
            chalk.bgGreen.bold(
              "---------- Result Analysis .md DOCUMENT ----------"
            )
          );
          console.log(noOptions);
        });
      }
    } else {
      console.log(
        chalk.bgRed.bold("-- RESULT: The path does not exist --")
      );
    }
  });
};

module.exports = {
  mdLinks,
};