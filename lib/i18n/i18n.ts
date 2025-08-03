import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpBackend from "i18next-http-backend";
import resourcesToBackend from "i18next-resources-to-backend";

import en from "@/public/locales/en/common.json";
import de from "@/public/locales/de/common.json";
import ua from "@/public/locales/ua/common.json";

const backend = resourcesToBackend({
  en: { common: en },
  de: { common: de },
  ua: { common: ua },
});

i18n
  .use(HttpBackend)
  .use(backend)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    supportedLngs: ["en", "de", "ua"],
    defaultNS: "common",
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json",
    },
  });

export default i18n;
