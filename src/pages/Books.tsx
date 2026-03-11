import { useEffect, useMemo, useState } from "react"
import { getBooks } from "../api/booksApi"
import { borrowBook } from "../api/borrowApi"
import type { Book } from "../types/Book"
import BookGrid from "../components/BookGrid"
import Navbar from "../components/Navbar"

type SortOption = "title-asc" | "title-desc" | "author-asc" | "rating-desc"

function Books() {
  const [books, setBooks] = useState<Book[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [query, setQuery] = useState("")
  const [genre, setGenre] = useState("all")
  const [sortBy, setSortBy] = useState<SortOption>("title-asc")

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const data = await getBooks()
        setBooks(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load books")
      } finally {
        setIsLoading(false)
      }
    }

    fetchBooks()
  }, [])

  const genres = useMemo(
    () => ["all", ...new Set(books.map((book) => book.genre).filter(Boolean) as string[])],
    [books]
  )

  const filteredBooks = useMemo(() => {
    const normalizedQuery = query.toLowerCase().trim()

    return books
      .filter((book) => {
        const matchesQuery =
          !normalizedQuery ||
          book.title.toLowerCase().includes(normalizedQuery) ||
          book.author.toLowerCase().includes(normalizedQuery) ||
          book.description.toLowerCase().includes(normalizedQuery)

        const matchesGenre = genre === "all" || book.genre === genre
        return matchesQuery && matchesGenre
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "title-desc":
            return b.title.localeCompare(a.title)
          case "author-asc":
            return a.author.localeCompare(b.author)
          case "rating-desc":
            return (b.rating ?? 0) - (a.rating ?? 0)
          case "title-asc":
          default:
            return a.title.localeCompare(b.title)
        }
      })
  }, [books, query, genre, sortBy])

  const handleBorrow = async (bookId: number) => {
    try {
      await borrowBook(bookId)
      setSuccessMessage("Book borrowed successfully. Check My Books to manage your loans.")
      setTimeout(() => setSuccessMessage(""), 2500)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to borrow book")
    }
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <section className="mb-8 rounded-3xl bg-gradient-to-r from-indigo-700 to-violet-600 p-8 text-white shadow-xl">
            <h1 className="mb-2 text-4xl font-black tracking-tight">Discover Your Next Favorite Book</h1>
            <p className="max-w-3xl text-indigo-100">
              Explore the full catalog, find books instantly, and borrow with one click.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
              <div className="rounded-xl bg-white/10 p-4">
                <p className="text-sm text-indigo-100">Books</p>
                <p className="text-2xl font-bold">{books.length}</p>
              </div>
              <div className="rounded-xl bg-white/10 p-4">
                <p className="text-sm text-indigo-100">Genres</p>
                <p className="text-2xl font-bold">{Math.max(genres.length - 1, 0)}</p>
              </div>
              <div className="rounded-xl bg-white/10 p-4">
                <p className="text-sm text-indigo-100">Available</p>
                <p className="text-2xl font-bold">
                  {books.filter((book) => (book.availableCopies ?? 1) > 0).length}
                </p>
              </div>
              <div className="rounded-xl bg-white/10 p-4">
                <p className="text-sm text-indigo-100">Filtered</p>
                <p className="text-2xl font-bold">{filteredBooks.length}</p>
              </div>
            </div>
          </section>

          <section className="mb-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by title, author, or description..."
                className="rounded-lg border border-gray-300 px-4 py-2 md:col-span-2"
              />

              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="rounded-lg border border-gray-300 px-4 py-2"
              >
                {genres.map((item) => (
                  <option key={item} value={item}>
                    {item === "all" ? "All genres" : item}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="rounded-lg border border-gray-300 px-4 py-2"
              >
                <option value="title-asc">Title (A-Z)</option>
                <option value="title-desc">Title (Z-A)</option>
                <option value="author-asc">Author (A-Z)</option>
                <option value="rating-desc">Top rated</option>
              </select>
            </div>
          </section>

          {error && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">{error}</div>
          )}

          {successMessage && (
            <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-700">
              {successMessage}
            </div>
          )}

          {isLoading ? (
            <div className="py-12 text-center text-gray-600">Loading books...</div>
          ) : filteredBooks.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white py-12 text-center text-gray-600">
              No books match your filters.
            </div>
          ) : (
            <BookGrid books={filteredBooks} onBorrow={handleBorrow} />
          )}
        </div>
      </div>
    </>
  )
}

export default Books
