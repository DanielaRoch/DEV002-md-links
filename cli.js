#!/usr/bin/env node
const { mdLinks } = require("./index.js");
const chalk = require("chalk");
const process = require("process");

const path = process.argv[2];
const option1 = process.argv[3];
const option2 = process.argv[4];

if (path) {
  console.log(chalk.bgBlueBright.bold("📂     WELCOME TO MD-LINKS LIBRARY     📂"));
  const validate = [option1, option2].filter(option => option === "--validate").length > 0;
  const stats = [option1, option2].filter(option => option === "--stats").length > 0;
  mdLinks(path, { validate: validate, stats: stats }).then((result) => result);
} else {
  console.log(chalk.bgRed.bold("ERROR: No file path"));
}