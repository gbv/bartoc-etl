export interface SolrDocument {
  id: string; // mapped from doc.uri
  title_en?: string; // mapped from doc.prefLabel.en
  description_en?: string; // mapped from doc.definition.en (first element)
  languages_ss: string[]; // mapped from doc.languages
  publisher_ss: string[]; // mapped from doc.publisher[].prefLabel.en
  alt_labels_ss: string[]; // mapped from doc.altLabel.und (if available)
  ddc_ss: string[]; // mapped from subject.notation
  created_dt?: string; // doc.created
  modified_dt?: string; // doc.modified
  start_year_i?: number; // doc.startDate, converted to integer
  url_s?: string; // doc.url
  type_ss: string[]; // doc.type
}
