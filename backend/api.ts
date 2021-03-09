import type { ShortenedURISlim, ShortenedURI } from "../types/api"

import { nanoid } from "nanoid"
import { Shortened } from "./models/shortened.model"

const defaultLength = Number(process.env.DEFAULT_SLUG_LENGTH || 4)

export const find = async (
  query: Partial<ShortenedURI>
): Promise<false | ShortenedURISlim> => {
  try {
    const found = await Shortened.findOne(query)
    if (found) {
      const { slug, target } = found
      return { slug, target }
    }
    return false
  } catch (err) {
    console.log("search err", err)
    return false
  }
}

export const create = async ({
  target,
  slug,
}: ShortenedURISlim): Promise<ShortenedURISlim> => {
  if (!slug) {
    slug = nanoid(defaultLength)

    while (await find({ slug })) {
      slug = nanoid(defaultLength)
    }
  }

  const created: ShortenedURI = { target, slug, created: new Date(), hits: 0 }
  const shorted = await Shortened.create(created)
  await shorted.save()

  return { slug, target }
}
