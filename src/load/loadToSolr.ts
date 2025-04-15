import fetch from "node-fetch";
import { SolrDocument } from "@/types/solr";

const SOLR_URL = "http://localhost:8983/solr/bartoc/update?commit=true";

export async function loadToSolr(docs: SolrDocument[]): Promise<void> {
  const response = await fetch(SOLR_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(docs),
  });

  const result = await response.json();

  if (!response.ok || result.responseHeader.status !== 0) {
    throw new Error(
      `Failed to load documents into Solr: ${JSON.stringify(result)}`,
    );
  }

  console.log(`Successfully indexed ${docs.length} documents into Solr.`);
}
