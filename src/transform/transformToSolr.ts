import { JskosDocument } from "../types/jskos";
import { SolrDocument } from "../types/solr";

export function transformToSolr(doc: JskosDocument): SolrDocument {
  return {
    id: doc.uri,
    title_en: doc.prefLabel?.en,
    description_en: doc.definition?.en?.[0],
    languages_ss: doc.languages || [],
    publisher_ss:
      doc.publisher?.map((p) => p.prefLabel?.en).filter(Boolean) || [],
    alt_labels_ss: doc.altLabel?.und || [],
    ddc_ss: doc.subject?.flatMap((s) => s.notation || []) || [],
    created_dt: doc.created,
    modified_dt: doc.modified,
    start_year_i: doc.startDate ? parseInt(doc.startDate) : undefined,
    url_s: doc.url,
    type_ss: doc.type || [],
  };
}
