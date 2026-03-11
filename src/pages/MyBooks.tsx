import { useEffect, useState } from "react"
import { getBorrowedBooks, returnBook } from "../api/borrowApi"
import Navbar from "../components/Navbar"
import { useAuth } from "../context/AuthContext"
import { Navigate } from "react-router-dom"

interface BorrowedBook {
  id: number
  bookId: number
  title: string
  author: string
  borrowDate: string
  dueDate: string
}

function MyBooks() {
  const { isAuthenticated } = useAuth()
  const [borrowedBooks, setBorrowedBooks] = useState<BorrowedBook[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchBorrowedBooks = async () => {
      try {
        const data = await getBorrowedBooks()
        setBorrowedBooks(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load borrowed books")
      } finally {
        setIsLoading(false)
      }
    }

    if (isAuthenticated) {
      fetchBorrowedBooks()
    }
  }, [isAuthenticated])

  const handleReturn = async (borrowId: number) => {
    try {
      await returnBook(borrowId)
      setBorrowedBooks(borrowedBooks.filter((b) => b.id !== borrowId))
      alert("Book returned successfully!")
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to return book")
    }
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">My Books</h1>
            <p className="text-gray-600">Books you've borrowed</p>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4 mb-4">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading your books...</p>
            </div>
          ) : borrowedBooks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">You haven't borrowed any books yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {borrowedBooks.map((book) => (
                <div key={book.id} className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{book.title}</h3>
                  <p className="text-gray-600 mb-4">{book.author}</p>
                  <p className="text-sm text-gray-500 mb-2">
                    Borrowed: {new Date(book.borrowDate).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    Due: {new Date(book.dueDate).toLocaleDateString()}
                  </p>
                  <button
                    onClick={() => handleReturn(book.id)}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md"
                  >
                    Return Book
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default MyBooks
