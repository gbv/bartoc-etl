import mongoose, { Connection } from "mongoose";
import type { Db } from "mongodb";
import config, { infoPackage } from "../conf/conf";
import checkAndInitMeta from "./initMeta";
// import { getUpgrades } from "./utils/version";
// import { Meta } from "./models/meta";
const version = infoPackage.version;
let db: Db | undefined;
const connection: Connection = mongoose.connection;

// Configurazione mongoose
mongoose.set("bufferCommands", true);
mongoose.set("bufferTimeoutMS", 30000);
mongoose.set("strictQuery", false);

connection.on("connected", () => {
  db = mongoose.connection.db; // Save the db object for later exports
  config.warn?.("✅ Connected to MongoDB");
});

const onDisconnected = () => {
  config.warn?.("⚠️ Disconnected from MongoDB, waiting for reconnect...");
};

export async function connect(retry: boolean = false) {
  connection.on("disconnected", onDisconnected);

  const addErrorHandler = () => {
    connection.on("error", (error) => {
      config.error?.("❌ MongoDB error:", error);
    });
  };

  // Se non è retry, ascolta prima gli errori
  if (!retry) addErrorHandler();

  const uri = `${config.mongo.url}/${config.mongo.db}`;
  let result: typeof mongoose | undefined;

  while (!result) {
    try {
      result = await mongoose.connect(uri, config.mongo.options);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      config.error?.(`❌ Failed to connect to MongoDB: ${message}`);

      if (!retry) {
        config.warn?.("🟡 MongoDB not connected. Continuing without DB.");
        break;
      }

      config.warn?.("⏳ Retrying MongoDB connection in 10 seconds...");
      await new Promise((res) => setTimeout(res, 10_000));
    }
  }

  if (retry) addErrorHandler();

  // Verify Meta collection and initialitation database
  if (connection) {
    await checkAndInitMeta(connection, version);
  }

  return result;
}

export function disconnect() {
  connection.removeListener("disconnected", onDisconnected);
  config.log?.("🛑 MongoDB disconnected (intentional)");
  return mongoose.disconnect();
}

export function getDb(): Db {
  if (!db) {
    throw new Error("❌ MongoDB not connected yet. Call connect() first.");
  }
  return db;
}

export { mongoose, connection };
