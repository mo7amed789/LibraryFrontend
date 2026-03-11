import api from "./axios"

export const borrowBook = async (bookId: number) => {
  const res = await api.post(`/borrow`, { bookId })
  return res.data
}

export const returnBook = async (borrowId: number) => {
  const res = await api.put(`/borrow/${borrowId}/return`)
  return res.data
}

export const getBorrowedBooks = async () => {
  const res = await api.get("/borrow/me")
  return res.data
}
