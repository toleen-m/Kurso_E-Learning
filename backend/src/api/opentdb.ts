import axios from "axios"
import dotenv from "dotenv"
dotenv.config()

export const opentdb = axios.create({
  baseURL: process.env.OPENTDB_API || "https://opentdb.com/api.php?amount=5&type=multiple",
  timeout: 10000
});