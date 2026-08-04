import {defineConfig} from "drizzle-kit";
import {getDbFilePath} from "./app/test/db-test.server";

export default defineConfig({
  dialect: "sqlite",
  schema: "./app/**/*.schema.ts", // adjust to your actual schema location
  out: "./drizzle",
  dbCredentials: {
    url: process.env.TURSO_URL ?? getDbFilePath(),
  },
});