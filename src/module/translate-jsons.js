import fs from "fs";
import path from "path";
import { translateHtml } from "./translate-html.js";

const inputDir = "./src/data/input";
const outputDir = "./src/data/output";

export async function translateJsons(language) {
  console.info("Translating JSONs...");

  const inputJsons = fs
    .readdirSync(inputDir)
    .filter((file) => path.extname(file) === ".json");

  const outputJsons = fs
    .readdirSync(outputDir)
    .filter((file) => path.extname(file) === ".json");

  for (const fileName of inputJsons) {
    if (outputJsons.includes(fileName)) {
      console.info(`Skipping ${fileName}`);
      continue;
    }

    try {
      console.info(`Translating ${fileName}`);
      const startTime = new Date().getTime();

      const translatedData = await translateJson(fileName, language);
      fs.writeFileSync(`${outputDir}/${fileName}`, translatedData);

      const endTime = new Date().getTime();
      console.info(`Translated in ${(endTime - startTime) / 1000} seconds`);
    } catch (error) {
      console.error(error);
    }
  }

  console.info("JSONs translated successfully!");
}

async function translateJson(fileName, language) {
  const file = fs.readFileSync(path.join(inputDir, fileName));

  const content = JSON.parse(file.toString());
  const entries = content.entries;

  const translatedEntries = await translateObject(entries, language);

  const translatedContent = { ...content, entries: translatedEntries };
  return JSON.stringify(translatedContent, null, 2);
}

async function translateObject(object, language) {
  const translatedObject = {};

  for (const key in object) {
    if (typeof object[key] === "object") {
      translatedObject[key] = await translateObject(object[key], language);
    } else {
      translatedObject[key] = await translateHtml(object[key], language);
    }
  }

  return translatedObject;
}
