import type { ShortenedURISlim } from "../types/api"

import Fastify from "fastify"
import fastifyCors from "fastify-cors"
import fastifyStatic from "fastify-static"
import { connectDB } from "./db"
import { disallowedSlugs, isURI, slugReg } from "../util"
import { create, find } from "./api"
import { join } from "path"

const fast = Fastify()
fast.register(fastifyCors, {
  origin: true,
})

fast.post("/@/create", async (req, res) => {
  const { target, slug } = req.body as ShortenedURISlim

  if (!isURI(target)) return res.code(400).send("not a valid URI")

  if (slug?.match(slugReg)) return res.code(400).send("not a valid slug")

  let found
  if (!slug) {
    found = await find({ target })
  } else found = await find({ target, slug })

  if (found) return res.code(200).send(found)

  try {
    const success = await create({ target, slug })
    if (!success) throw new Error()

    return res.code(200).send(success)
  } catch (err) {
    return res.code(409).send("slug already in use maybe")
  }
})

fast.addHook("onRequest", async (req, rep) => {
  if (disallowedSlugs.includes(req.url.slice(1)) || req.url.startsWith("/assets/")) return

  const slug = req.url.slice(1)
  const found = await find({ slug })

  console.log("found", found, "route", req.url)
  if (found) return rep.redirect(307, found.target)

  return rep.redirect(307, "/")
})

fast.register(fastifyStatic, {
  root: join(__dirname, "../dist"),
  prefix: "/",
})

fast.listen(process.env.BACKEND_PORT || 8000).then(async addr => {
  console.log(`listening on ${addr}`)
  try {
    await connectDB()
    console.log("mongo connected")
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
})
