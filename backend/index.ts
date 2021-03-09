import type { ShortenedURISlim } from "../types/api"

import Fastify from "fastify"
import fastifyCors from "fastify-cors"
import { connectDB } from "./db"
import { isURI } from "../util"
import { create, find } from "./api"

const fast = Fastify()
fast.register(fastifyCors, {
  // TODO
  origin: true,
})

fast.post("/@/create", async (req, res) => {
  const { target, slug } = req.body as ShortenedURISlim

  if (!isURI(target)) return res.code(400).send("not a valid URI")

  let found
  if (!slug) {
    found = await find({ target })
  } else found = await find({ target, slug })

  if (found) return res.code(200).send(found)

  try {
    return res.code(200).send(await create({ target, slug }))
  } catch (err) {
    if (err.code === 11000) return res.code(409).send("slug in use")
  }
})

fast.get("/*", async (req, rep) => {
  const slug = req.url.slice(1)
  const found = await find({ slug })

  if (found) return rep.redirect(301, found.target)

  return rep.redirect(301, "/")
})

fast.get("/", async (_, rep) => {
  rep.code(200).send("ok bro")
})

fast.listen(8000).then(async addr => {
  console.log(`listening on ${addr}`)
  try {
    await connectDB()
    console.log("mongo connected")
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
})
