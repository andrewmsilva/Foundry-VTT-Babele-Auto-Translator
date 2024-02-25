import translator from "@parvineyvazov/json-translator";

global.source = translator.Sources.BingTranslate;

export const languages = translator.getLanguages();
