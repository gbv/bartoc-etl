import config from "../conf/conf";
import { getDb } from "../mongo/mongo";
import type { Db } from "mongodb";
import type { TerminologyDocument } from "../types/terminology";
import { terminologyZodSchema } from "../mongo/terminologySchemaValidation";

import { ChangeStreamInsertDocument } from "mongodb";
import { Terminology } from "../models/terminology";

export async function watchTerminologies(): Promise<void> {
  const db: Db | undefined = getDb();
  const collection = db.collection("terminologies");

  try {
    config.log?.("👀 Watching changes on 'terminologies' collection...");

    Terminology.watch().on(
      "change",
      (change: ChangeStreamInsertDocument<TerminologyDocument>) => {
        config.log?.("🔄 Change detected!");

        if (change.operationType === "insert") {
          const rawDoc = change.fullDocument;

          // Validate with Zod
          const result = terminologyZodSchema.safeParse(rawDoc);

          if (!result.success) {
            config.error?.(
              "❌ Invalid JSKOS document detected via watcher:",
              result.error.message,
            );
            return;
          }

          const jskosDocument = result.data;
          config.log?.(
            "📥 Valid JSKOS document inserted:",
            JSON.stringify(jskosDocument, null, 2),
          );

          // -> Start Extract logic here
        }
      },
    );

    Terminology.on("error", (err: Error) => {
      config.error?.("❌ Watcher error:", err.message);
      // Optionally: try to re-establish watch
      setTimeout(() => {
        config.warn?.("🔁 Restarting watcher after error...");
        watchTerminologies();
      }, 10000); // 10s delay
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    config.error?.(`❌ Failed to start watch stream:", ${message}`);
  }
}
