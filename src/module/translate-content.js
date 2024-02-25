import { languages } from "./languages.js";
import { Sources, translateWord } from "@parvineyvazov/json-translator";

global.source = Sources.BingTranslate;
console.log = function () {};

const separator = "&nbsp;".repeat(2);

export async function translateContent(content, language, attempts = 0) {
  if (!/[a-zA-Z]/.test(content)) {
    return content;
  }

  if (content.includes("@Compendium")) {
    const splitContent = content.split(
      /(@Compendium\[[a-zA-Z0-9.]*\]\{[a-zA-Z0-9]*\})/
    );

    const compendiumLinks = [];
    let contentWithoutLinks = "";

    splitContent.forEach((part, index) => {
      if (part.includes("@Compendium")) {
        const splitParts = part.split(/{|}/);
        compendiumLinks[index] = [splitParts[0], splitParts[2]];

        contentWithoutLinks += `${index === 0 ? "" : separator}${
          splitParts[1]
        }${index === splitContent.length - 1 ? "" : separator}`;
      } else {
        contentWithoutLinks += part;
      }
    });

    const translatedContent = await translateContent(
      contentWithoutLinks,
      language
    );

    const translatedSplitContent = translatedContent.split(separator);

    compendiumLinks.forEach(([link, after], index) => {
      translatedSplitContent[index] = `${link}{${
        translatedSplitContent[index]
      }}${after ?? ""}`;
    });

    return translatedSplitContent.join("");
  }

  const convertedContent = convertMeasurements(content);

  let translatedContent = await translateWord(
    convertedContent,
    languages.English,
    language
  );

  if (translatedContent === "--") {
    if (attempts !== 100) {
      await new Promise((resolve) => setTimeout(resolve, 5000));
      return translateContent(content, language, (attempts ?? 0) + 1);
    } else {
      throw new Error("Failed to translate content", convertedContent);
    }
  }

  if (content[0] === " " && translatedContent[0] !== " ") {
    translatedContent = ` ${translatedContent}`;
  }

  if (
    content[content.length - 1] === " " &&
    translatedContent[translatedContent.length - 1] !== " "
  ) {
    translatedContent = `${translatedContent} `;
  }

  return translatedContent;
}

function convertMeasurements(text) {
  const regex =
    /(\d+(\.\d+)?)\s*(inch(es)?|foot|feet|yd|yard|mile|oz|ounce|lb|pound)s?/gi;

  const conversionToMeters = {
    in: 0.0254,
    inch: 0.0254,
    inches: 0.0254,
    foot: 0.3048,
    feet: 0.3048,
    yd: 0.9144,
    yard: 0.9144,
    mi: 1609.34,
    mile: 1609.34,
  };

  const conversionToKilograms = {
    oz: 0.0283495,
    ounce: 0.0283495,
    lb: 0.453592,
    pound: 0.453592,
  };

  function replaceMeasurement(match, value, _, unit) {
    let measurementInMeters;
    unit = unit.toLowerCase();
    if (unit in conversionToMeters) {
      measurementInMeters = value * conversionToMeters[unit];
      if (measurementInMeters < 1) {
        return `${Math.round(measurementInMeters * 100)} centimeters`;
      } else if (measurementInMeters > 1000) {
        return `${Math.round(measurementInMeters / 1000)} kilometers`;
      } else {
        return `${Math.round(measurementInMeters)} meters`;
      }
    }
    return match;
  }

  function replaceWeight(match, value, _, unit) {
    let weightInKilograms;
    unit = unit.toLowerCase();
    if (unit in conversionToKilograms) {
      weightInKilograms = value * conversionToKilograms[unit];
      if (weightInKilograms < 1) {
        return `${Math.round(weightInKilograms * 1000)} grams`;
      } else {
        return `${Math.round(weightInKilograms)} kilograms`;
      }
    }
    return match;
  }

  text = text.replace(regex, replaceMeasurement);
  text = text.replace(regex, replaceWeight);

  return text;
}
