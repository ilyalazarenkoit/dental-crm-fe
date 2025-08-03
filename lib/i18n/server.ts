import { createInstance } from "i18next";
import resourcesToBackend from "i18next-resources-to-backend";
import { headers } from "next/headers";

import en from "@/public/locales/en/common.json";
import de from "@/public/locales/de/common.json";
import ua from "@/public/locales/ua/common.json";

const initI18next = async (lang: string) => {
  const i18nInstance = createInstance();
  await i18nInstance
    .use(
      resourcesToBackend({
        en: { common: en },
        de: { common: de },
        ua: { common: ua },
      })
    )
    .init({
      lng: lang,
      fallbackLng: "en",
      supportedLngs: ["en", "de", "ua"],
      defaultNS: "common",
      preload: ["en", "de", "ua"],
      ns: ["common"],
      interpolation: {
        escapeValue: false,
      },
    });
  return i18nInstance;
};

export async function createTranslation() {
  const headersList = await headers();
  const lang =
    headersList.get("accept-language")?.split(",")[0].split("-")[0] || "de";
  const i18n = await initI18next(lang);

  return {
    t: (key: string, options = {}) => {
      const translation = i18n.t(key, { ns: "common", ...options });
      return translation;
    },
  };
}
