import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "https://sistema-reserva-salas-ten.vercel.app",

    setupNodeEvents(on, config) {
      // Mantenha aqui seus eventos já existentes.

      config.env.TEST_EMAIL = process.env.CYPRESS_TEST_EMAIL;
      config.env.TEST_PASSWORD = process.env.CYPRESS_TEST_PASSWORD;

      return config;
    },
  },
});