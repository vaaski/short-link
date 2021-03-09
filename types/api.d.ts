import type { Document } from "mongoose"

export interface ShortenedURI {
  target: string
  slug: string
  created: Date
  hits: number
}

export interface ShortenedURISlim extends ShortenedURI {
  slug?: string
  created?: Date
  hits?: number
}

export interface ShortenedURISchema extends Document, ShortenedURI {}
