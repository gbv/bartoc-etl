export interface MongoOptions {
  connectTimeoutMS?: number;
  socketTimeoutMS?: number;
  heartbeatFrequencyMS?: number;
}

export interface MongoConfig {
  user?: string;
  pass?: string;
  host: string;
  port: number;
  db: string;
  options?: MongoOptions;
  auth?: string;
  url?: string;
}

export interface SolrConfig {
  host: string;
  port: number;
  url?: string;
  version: number;
}

export interface AppConfig {
  baseUrl?: string | null;
  closedWorldAssumption?: boolean;
  env: string;
  loadNdjsonData?: boolean;
  logLevel: string;
  mongo: MongoConfig;
  ndJsonDataPath?: string;
  port: number;
  proxies?: string[];
  solr: SolrConfig;
  title?: string;
  verbosity?: Verbosity;
  version?: string | null;
  // Optional helpers & runtime fields
  log?: (...args: string[]) => void;
  warn?: (...args: string[]) => void;
  error?: (...args: string[]) => void;
  getDirname?: (url: string) => string;
  status?: unknown;
}

export type Verbosity = boolean | "log" | "warn" | "error";
