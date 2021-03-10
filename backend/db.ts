import mongoose from "mongoose"

const address = process.env.MONGO_URI || ""

export const connectDB = async (): Promise<typeof mongoose> => {
  mongoose.set("useFindAndModify", false)
  mongoose.set("useCreateIndex", true)

  return await mongoose.connect(address, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
}
