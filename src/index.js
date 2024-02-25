import { languages } from "./module/languages.js";
import { translateJsons } from "./module/translate-jsons.js";

(async () => {
  await translateJsons(languages.Portuguese_Brazil);
})();
