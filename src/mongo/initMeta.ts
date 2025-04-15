import mongoose from "mongoose";
import config from "../conf/conf";
import { Meta, MetaDocument } from "../models/meta";
import { Terminology } from "../models/terminology";

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

    const doc = await connection.collection("terminologies").countDocuments();
    config.log?.("collection terminologies length is", doc.toString());

    let meta: MetaDocument | null = null;

    /* const firstDoc = await Terminology.find().limit(1);

    if (firstDoc) {
      config.log?.(
        "collection terminologies first element ",
        JSON.stringify(firstDoc, null, 2),
      );
    } */

    // This means that this is the first launch, as collections is equal to Zero
    if (!collections.length) {
      meta = new Meta({ version });
      await meta.save();
      config.log?.("📦 Created new meta collection with version:", version);
    } else if (!collections.includes("meta")) {
      meta = new Meta({ version: "1.1.9" });
      await meta.save();
      config.log?.("📦 Created legacy meta with version 1.1.9");
    } else {
      meta = await Meta.findOne();
    }
  } catch (error) {
    config.error?.(
      `❌ MongoDB connection is not available with error ${error}`,
    );
  }
};
export default checkAndInitMeta;
