// types/terminology.d.ts

import { Document } from "mongoose";
import { JskosDocument } from "./jskos"; // adjust path if needed

export type TerminologyDocument = Document & JskosDocument;
