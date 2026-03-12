import api from "./axios"
import type { Book } from "../types/Book"

const unwrap = <T>(payload: T | { data: T } | { items: T }): T => {
  if (payload && typeof payload === "object" && "data" in payload) return payload.data
  if (payload && typeof payload === "object" && "items" in payload) return payload.items
  return payload as T
}

const normalizeBook = (rawBook: Record<string, unknown>): Book => ({
  id: Number(rawBook.id ?? rawBook.bookId ?? 0),
  title: String(rawBook.title ?? "Untitled"),
  author: String(rawBook.author ?? "Unknown"),
  description: String(rawBook.description ?? "No description available."),
  genre: rawBook.genre ? String(rawBook.genre) : undefined,
  publishedYear: rawBook.publishedYear ? Number(rawBook.publishedYear) : undefined,
  availableCopies: rawBook.availableCopies ? Number(rawBook.availableCopies) : undefined,
  totalCopies: rawBook.totalCopies ? Number(rawBook.totalCopies) : undefined,
  rating: rawBook.rating ? Number(rawBook.rating) : undefined,
})

export const getBooks = async (): Promise<Book[]> => {
  const res = await api.get<Book[] | { data: Book[] } | { items: Book[] }>("/books")
  const list = unwrap(res.data)

  if (!Array.isArray(list)) {
    return []
  }

  return list.map((book) => normalizeBook(book as unknown as Record<string, unknown>))
}
