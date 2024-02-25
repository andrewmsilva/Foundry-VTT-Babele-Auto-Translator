import { translateJsons } from "./module/translate-jsons.js";
import { languages } from "./module/languages.js";

(async () => {
  await translateJsons(languages.Portuguese_Brazil);
})();
