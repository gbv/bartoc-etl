import _ from "lodash";
import * as dotenv from "dotenv";
import fs from "fs";
import path from "path";
import type { AppConfig, Verbosity } from "../types/conf";
import { loadConfig } from "../utils/loadConfig";

import packageInfo from "../../package.json";

// Prepare environment
dotenv.config();
const env = process.env.NODE_ENV ?? "development";
const configFile = process.env.CONFIG_FILE || "./config/config.json";
const defaultFile = "./config/config.default.json";
const configFilePath = path.resolve(process.cwd(), configFile);
const defaultFilePath = path.resolve(process.cwd(), defaultFile);
export const infoPackage = packageInfo;

// If file doesn't exist, create it with an empty object
if (env !== "test" && !fs.existsSync(configFilePath)) {
  fs.writeFileSync(configFilePath, "{}");
}

// loading the config.default.json
const config: AppConfig = loadConfig(defaultFilePath);

// Set composed config variables
config.mongo.auth = config.mongo.user
  ? `${config.mongo.user}:${config.mongo.pass}@`
  : "";
config.mongo.url = `mongodb://${config.mongo.auth}${config.mongo.host}:${config.mongo.port}`;

// Build solr url, basic only for local development
config.solr.url = `http://${config.solr.host}:${config.solr.port}/solr`;

// Logging section
function isValidVerbosity(v: unknown): v is Verbosity {
  return [true, false, "log", "warn", "error"].includes(v as string);
}

if (!isValidVerbosity(config.verbosity)) {
  console.warn(
    `Invalid verbosity value "${config.verbosity}", defaulting to "${config.verbosity}" instead.`,
  );
}

// Logging methods
config.log = (...args: unknown[]) => {
  if (
    config.env !== "test" &&
    (config.verbosity === true || config.verbosity === "log")
  ) {
    console.log(new Date(), ...args);
  }
};

config.warn = (...args: unknown[]) => {
  if (
    config.env !== "test" &&
    (config.verbosity === true ||
      config.verbosity === "log" ||
      config.verbosity === "warn")
  ) {
    console.warn(new Date(), ...args);
  }
};

config.error = (...args: unknown[]) => {
  if (config.env !== "test" && config.verbosity !== false) {
    console.error(new Date(), ...args);
  }
};

export default config;
