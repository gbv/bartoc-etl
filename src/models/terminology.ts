import mongoose, { Schema, Document, Model } from "mongoose";
import type { JskosDocument } from "../types/jskos"; // ← assuming you defined the interface here

const TerminologySchema = new Schema<JskosDocument>(
  {
    "@context": { type: String, required: true },
    ACCESS: [
      {
        uri: { type: String, required: true },
        _id: false,
      },
    ],
    ADDRESS: {
      code: String,
      country: String,
      locality: String,
      region: String,
      street: String,
    },
    FORMAT: [
      {
        uri: { type: String },
        _id: false,
      },
    ],
    altLabel: { type: Object, required: false },
    contributor: [
      {
        prefLabel: {
          en: String,
        },
        uri: String,
        _id: false,
      },
    ],
    created: String,
    creator: [
      {
        prefLabel: {
          en: String,
        },
        uri: String,
        _id: false,
      },
    ],
    definition: {
      type: Object,
      required: false,
    },
    languages: [String],
    modified: String,
    prefLabel: { type: Object, required: false },
    publisher: [
      {
        prefLabel: {
          en: String,
        },
        uri: String,
        _id: false,
      },
    ],
    startDate: String,
    subject: [
      {
        inScheme: [{ uri: String }],
        notation: [String],
        uri: String,
        _id: false,
      },
    ],
    type: [String],
    uri: { type: String, required: true },
    url: String,
  },
  {
    collection: "terminologies",
    strict: true, // strips unknown fields
  },
);

export interface TerminologyDocument extends JskosDocument, Document {}

export const Terminology: Model<JskosDocument> = mongoose.model(
  "terminology",
  TerminologySchema,
);
