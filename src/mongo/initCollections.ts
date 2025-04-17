import mongoose from "mongoose";
import config from "../conf/conf";
import { Meta, MetaDocument } from "../models/meta";
import { Terminology } from "../models/terminology";
import { terminologyZodSchema } from "./terminologySchemaValidation";
import fs from "fs";
import readline from "readline";

const checkAndInitDbCollections = async (
  connection: mongoose.Connection,
  version: string,
) => {
  if (!connection?.db) {
    config.error?.("❌ MongoDB connection is not available.");
    return;
  }

  try {
    const collections = (await connection.db.listCollections().toArray()).map(
      (c) => c.name,
    );

    const hasTerminologies = collections.some((c) => c === "terminologies");
    const hasMeta = collections.some((c) => c === "meta");

    if (!hasMeta) {
      try {
        const metaCollection: MetaDocument = new Meta({ version });
        await metaCollection.save();
        config.log?.("📦 Created new meta collection with version:", version);
      } catch (err) {
        config.error?.(
          "❌ Failed to create meta collection:",
          (err as Error).message,
        );
      }
    }

    if (!hasTerminologies) {
      try {
        await mongoose.connection.createCollection("terminologies");
        config.log?.(
          "📦 Created terminologies collection because it didn't exist.",
        );
      } catch (err) {
        config.error?.(
          "❌ Failed to create terminologies collection:",
          (err as Error).message,
        );
      }
    }

    if (collections.length) {
      config.log?.(
        "We have set up the following collections",
        collections.toString(),
      );
      const terminologiesDocs = await connection
        .collection("terminologies")
        .countDocuments();

      if (!terminologiesDocs) {
        config.log?.("Collection terminologies is empty");
        if (terminologiesDocs === 0 && config.loadNdjsonData === true) {
          // This means that the collection is
          await importFromNDJSON(
            config.ndJsonDataPath ? config.ndJsonDataPath : "",
          );
        }
      } else {
        config.log?.(
          "collection terminologies length is",
          terminologiesDocs.toString(),
        );
      }
    }
  } catch (error) {
    config.error?.(
      `❌ MongoDB connection is not available with error ${error}`,
    );
  }
};

export async function importFromNDJSON(filePath: string): Promise<void> {
  if (!filePath) {
    console.error("❌ Problem with path");
  }

  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let success = 0;
  let errors = 0;

  for await (const line of rl) {
    if (!line.trim()) continue;
    try {
      const parsed = JSON.parse(line);
      const validation = terminologyZodSchema.safeParse(parsed);
      if (!validation.success) {
        console.error("❌ Validation failed:", validation.error.format());
        errors++;
        continue;
      }

      const terminology = new Terminology(validation.data);
      await terminology.save();
      success++;
    } catch (err) {
      console.error("❌ Failed to process line:", err);
      errors++;
    }
  }
}

export default checkAndInitDbCollections;
