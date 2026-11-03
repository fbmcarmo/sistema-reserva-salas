import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl:
      process.env.CYPRESS_BASE_URL ||
      "https://sistema-reserva-salas-ten.vercel.app",

    viewportWidth: 1280,
    viewportHeight: 720,
  },
});