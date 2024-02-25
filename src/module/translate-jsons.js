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

  const entriesKeys = Object.keys(content.entries);

  process.stdout.write(`Translated 0 of ${entriesKeys.length} entries\n`);

  for (let i = 0; i < entriesKeys.length; i++) {
    const key = entriesKeys[i];
    const entry = content.entries[key];
    const translatedEntry = await translateEntry(entry, language);
    content.entries[key] = translatedEntry;

    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(
      `Translated ${i + 1} of ${entriesKeys.length} entries`
    );
  }

  return JSON.stringify(content, null, 2);
}

async function translateEntry(entry, language) {
  const translatedEntry = {};

  for (const key in entry) {
    if (typeof entry[key] === "object") {
      translatedEntry[key] = await translateEntry(entry[key], language);
    } else {
      translatedEntry[key] = await translateHtml(entry[key], language);
    }
  }

  return translatedEntry;
}
