import api from "./axios"

export interface BorrowedBook {
  id: number
  bookId: number
  title: string
  author: string
  borrowDate: string
  dueDate: string
}

const unwrap = <T>(payload: T | { data: T } | { items: T }): T => {
  if (payload && typeof payload === "object" && "data" in payload) return payload.data
  if (payload && typeof payload === "object" && "items" in payload) return payload.items
  return payload as T
}

const normalizeBorrowedBook = (item: Record<string, unknown>): BorrowedBook => ({
  id: Number(item.id ?? item.borrowId ?? 0),
  bookId: Number(item.bookId ?? 0),
  title: String(item.title ?? item.bookTitle ?? "Untitled"),
  author: String(item.author ?? "Unknown"),
  borrowDate: String(item.borrowDate ?? new Date().toISOString()),
  dueDate: String(item.dueDate ?? new Date().toISOString()),
})

export const borrowBook = async (bookId: number) => {
  const res = await api.post("/borrow", { bookId })
  return res.data
}

export const returnBook = async (borrowId: number) => {
  const res = await api.put(`/borrow/${borrowId}/return`)
  return res.data
}

export const getBorrowedBooks = async (): Promise<BorrowedBook[]> => {
  const res = await api.get<BorrowedBook[] | { data: BorrowedBook[] } | { items: BorrowedBook[] }>("/borrow/me")
  const list = unwrap(res.data)

  if (!Array.isArray(list)) {
    return []
  }

  return list.map((item) => normalizeBorrowedBook(item as unknown as Record<string, unknown>))
}
