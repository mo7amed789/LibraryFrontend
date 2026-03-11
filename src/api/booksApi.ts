import api from "./axios"

export const getBooks = async () => {
  const res = await api.get("/Books")
  return res.data
}