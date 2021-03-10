import type { ShortenedURISlim, ShortenedURI } from "../types/api"

import { nanoid } from "nanoid"
import { Shortened } from "./models/shortened.model"

const defaultLength = Number(process.env.DEFAULT_SLUG_LENGTH || 4)

export const find = async (
  query: Partial<ShortenedURI>
): Promise<false | ShortenedURISlim> => {
  try {
    const found = await Shortened.findOneAndUpdate(query, { $inc: { hits: 1 } })
    if (found) {
      const { slug, target, hits } = found
      return { slug, target, hits }
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
}: ShortenedURISlim): Promise<ShortenedURISlim | false> => {
  if (!slug) {
    slug = nanoid(defaultLength)

    while (await find({ slug })) {
      slug = nanoid(defaultLength)
    }
  } else {
    if (await find({ slug })) return false
  }

  const created: ShortenedURI = { target, slug, created: new Date(), hits: 0 }
  const shorted = await Shortened.create(created)
  await shorted.save()

  return { slug, target }
}
