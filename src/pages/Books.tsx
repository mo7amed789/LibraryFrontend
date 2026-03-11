import { useEffect, useState } from "react"
import { getBooks } from "../api/booksApi"
import { borrowBook } from "../api/borrowApi"
import type { Book } from "../types/Book"
import BookGrid from "../components/BookGrid"
import Navbar from "../components/Navbar"

function Books() {
  const [books, setBooks] = useState<Book[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

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

  const handleBorrow = async (bookId: number) => {
    try {
      await borrowBook(bookId)
      alert("Book borrowed successfully!")
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to borrow book")
    }
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Library Books</h1>
            <p className="text-gray-600">Browse and borrow books from our collection</p>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4 mb-4">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading books...</p>
            </div>
          ) : books.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No books available</p>
            </div>
          ) : (
            <BookGrid books={books} onBorrow={handleBorrow} />
          )}
        </div>
      </div>
    </>
  )
}

export default Books