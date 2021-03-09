import mongoose from "mongoose"

const address = process.env.MONGO_URI || ""

export const connectDB = (): Promise<typeof mongoose> =>
  mongoose.connect(address, { useNewUrlParser: true, useUnifiedTopology: true })
