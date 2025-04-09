console.log("👋 Hello from Bartoc ETL");

import { readNdjson } from "./extract/readNdjson";
import { transformToSolr } from "./transform/transformToSolr";

async function main() {
  const path = "./data/latest.ndjson";
  const docs = await readNdjson(path);

  if (docs.length > 0) {
    const solrDoc = transformToSolr(docs[0]);
    console.log("Transformed Solr document:", solrDoc);
  }
}

main();
