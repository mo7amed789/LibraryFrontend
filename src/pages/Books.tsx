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
      <div className="page">
        <section className="glass hero">
          <h1>Discover Your Next Favorite Book</h1>
          <p>Futuristic digital library experience: smart search, smooth borrowing, and real-time discovery insights.</p>
          <div className="stats">
            <div className="stat">
              <p className="label">Books</p>
              <p className="value">{books.length}</p>
            </div>
            <div className="stat">
              <p className="label">Genres</p>
              <p className="value">{Math.max(genres.length - 1, 0)}</p>
            </div>
            <div className="stat">
              <p className="label">Available</p>
              <p className="value">{books.filter((book) => (book.availableCopies ?? 1) > 0).length}</p>
            </div>
            <div className="stat">
              <p className="label">Filtered</p>
              <p className="value">{filteredBooks.length}</p>
            </div>
          </div>
        </section>

        <section className="glass filters">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, author, or description..."
          />
          <select value={genre} onChange={(e) => setGenre(e.target.value)}>
            {genres.map((item) => (
              <option key={item} value={item}>
                {item === "all" ? "All genres" : item}
              </option>
            ))}
          </select>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value as SortOption)}>
            <option value="title-asc">Title (A-Z)</option>
            <option value="title-desc">Title (Z-A)</option>
            <option value="author-asc">Author (A-Z)</option>
            <option value="rating-desc">Top rated</option>
          </select>
        </section>

        {error && <div className="error">{error}</div>}
        {successMessage && <div className="success">{successMessage}</div>}

        {isLoading ? (
          <div className="empty">Loading books...</div>
        ) : filteredBooks.length === 0 ? (
          <div className="glass empty">No books match your filters.</div>
        ) : (
          <BookGrid books={filteredBooks} onBorrow={handleBorrow} />
        )}
      </div>
    </>
  )
}

export default Books
