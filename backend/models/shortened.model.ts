import mongoose, { Schema } from "mongoose"
import { ShortenedURISchema } from "../../types/api"

const ShortenedSchema: Schema = new mongoose.Schema({
  target: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  created: { type: Date, required: true },
  hits: { type: Number, default: 0 },
})

export const Shortened = mongoose.model<ShortenedURISchema>("shortend", ShortenedSchema)
