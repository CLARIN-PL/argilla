export default {
  locales: [
    {
      code: "en",
      name: "English",
      file: "en/index.js",
    },
    {
      code: "pl",
      name: "Polski",
      file: "pl/index.js",
    },
  ],
  vueI18n: {
    fallbackLocale: "pl",
  },
  defaultLocale: "pl",
  lazy: true,
  strategy: "no_prefix",
  langDir: "i18n/",
  detectBrowserLanguage: {
    useCookie: true,
    cookieKey: "i18n_redirected",
    redirectOn: "root",
  },
};
