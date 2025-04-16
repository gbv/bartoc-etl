import mongoose from "mongoose";
import config from "../conf/conf";
import { Meta, MetaDocument } from "../models/meta";
import { Terminology } from "../models/terminology";
import { terminologyZodSchema } from "../mongo/terminologySchemaValidation";
import fs from "fs";
import readline from "readline";

const checkAndInitMeta = async (
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

    config.log?.(
      "We have set up the following collections",
      collections.toString(),
    );

    const terminologiesDocs = await connection
      .collection("terminologies")
      .countDocuments();

    config.log?.(
      "collection terminologies length is",
      terminologiesDocs.toString(),
    );

    //
    if (terminologiesDocs === 0 && config.loadNdjsonData === true) {
      // This means that the collection is
      await importFromNDJSON(
        config.ndJsonDataPath ? config.ndJsonDataPath : "",
      );
    }

    // This means that this is the first launch, we have no collections!
    if (!collections.length) {
      // Meta collection
      const metaCollection: MetaDocument = new Meta({ version });
      await metaCollection.save();
      config.log?.("📦 Created new meta collection with version:", version);
      // Create Terminologies Collection
      const terminologiesCollection = new Terminology();
      await terminologiesCollection.save();
      config.log?.("📦 Created new terminologies collection");

      // Load the  ndJsonData inside the data folder
      if (config.loadNdjsonData) {
        await importFromNDJSON(
          config.ndJsonDataPath ? config.ndJsonDataPath : "",
        );
      }
    } else if (!collections.includes("meta")) {
      const metaCollectionLegagy = new Meta({ version: "1.1.9" });
      await metaCollectionLegagy.save();
      config.log?.("📦 Created legacy meta with version 1.1.9");
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

export default checkAndInitMeta;
