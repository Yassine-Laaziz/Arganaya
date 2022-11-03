import mongoose from "mongoose"

const connection = {}

export const connect = async () => {
  if (connection.isConnected) return
  mongoose.connect(process.env.MONGO_URI)
  connection.isConnected = true
}
