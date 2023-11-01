const { defineConfig } = require("cypress");

const ENV_CONFIG = {
  local: {
    BASE_URL: "http://localhost:" + process.env.PORT,
  },
  desarrollo: {
    BASE_URL: "http://direccion-desarrollo:" + process.env.PORT,
  },
  quality: {
    BASE_URL: "http://direccion-quality:" + process.env.PORT,
  },
};

const CURRENT_ENV = process.env.CYPRESS_ENV || "local"; // local es el valor predeterminado
const CURRENT_CONFIG = ENV_CONFIG[CURRENT_ENV];

module.exports = defineConfig({
  e2e: {
    baseUrl: CURRENT_CONFIG.BASE_URL,
    setupNodeEvents(on, config) {
      on("before:browser:launch", (browser = {}, launchOptions) => {
        if (browser.family === "chromium" && browser.name !== "electron") {
          launchOptions.args.push("--disable-web-security");
        }
        return launchOptions;
      });
    },
    chromeWebSecurity: false,
  },
});
