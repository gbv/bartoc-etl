export interface JskosDocument {
  "@context": string;
  ACCESS?: Array<{
    uri: string;
  }>;
  ADDRESS?: {
    code?: string;
    country?: string;
    locality?: string;
    region?: string;
    street?: string;
  };
  FORMAT?: Array<{
    uri: string;
  }>;
  altLabel?: { [lang: string]: string[] };
  //concepts?: any[]; // Refine later
  contributor?: Array<{
    prefLabel: { en?: string };
    uri: string;
  }>;
  created: string;
  creator?: Array<{
    prefLabel: { en?: string };
    uri: string;
  }>;
  definition?: { [lang: string]: string[] };
  languages: string[];
  modified: string;
  prefLabel: { [lang: string]: string };
  publisher?: Array<{
    prefLabel: { en?: string };
    uri: string;
  }>;
  startDate?: string;
  subject?: Array<{
    inScheme?: Array<{ uri: string }>;
    notation?: string[];
    uri: string;
  }>;
  // topConcepts?: any[]; Refine later
  type: string[];
  uri: string;
  url?: string;
}
