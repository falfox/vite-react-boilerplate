import { axiosInstance as axios } from "./axios"

export async function sendMessage(data: {
  recipient: string
  text: string
  device: string
}) {
  return await axios.post("/api/sender", data)
}
