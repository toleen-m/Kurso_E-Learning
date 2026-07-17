import axios from "axios"
import dotenv from "dotenv"
dotenv.config()

export const opentdb = axios.create({
  baseURL: process.env.OPENTDB_API || "https://opentdb.com",
  timeout: 10000
});