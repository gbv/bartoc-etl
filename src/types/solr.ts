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

// Not used
export interface SolrClient {
  add(doc: object | object[]): Promise<void>;
  commit(): Promise<void>;
  deleteById(id: string): Promise<void>;
  deleteByQuery(query: string): Promise<void>;
  // query(q: string, options?: QueryOptions): Promise<SolrResponse>;
  ping(): Promise<boolean>;
}

// Not used
export interface SolrPingResponse {
  status: string;
}

// Not used
export interface SolrSystemInfoResponse {
  lucene: Record<string, unknown>;
  jvm: Record<string, unknown>;
  solr_home: string;
}

// used in CollectionOperation.ts
export enum CollectionAction {
  CREATE = "CREATE",
  DELETE = "DELETE",
  RELOAD = "RELOAD",
  LIST = "LIST", // for Solr CLoud, i.e. GET /solr/admin/collections?action=LIST&wt=json
  STATUS = "STATUS", // for solr based on cores, i.e. GET /solr/admin/cores?action=STATUS&wt=json
  PING = "PING",
}

// use in index.ts
export interface PingResponse {
  status: string;
  QTime: number;
}

// Not used
export interface CollectionOperationQueryParams {
  action: CollectionAction;
  name?: string;
  config?: string;
  deleteInstanceDir?: boolean;
  [key: string]: string | number | boolean | undefined;
}
