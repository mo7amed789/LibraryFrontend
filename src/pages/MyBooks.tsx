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

    if (isAuthenticated) fetchBorrowedBooks()
  }, [isAuthenticated])

  const handleReturn = async (borrowId: number) => {
    try {
      await returnBook(borrowId)
      setBorrowedBooks((prev) => prev.filter((b) => b.id !== borrowId))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to return book")
    }
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />

  return (
    <>
      <Navbar />
      <div className="page">
        <header className="section-title">
          <h1>My Borrowed Books</h1>
          <p className="helper">Track due dates and return books with one click.</p>
        </header>

        {error && <div className="error">{error}</div>}

        {isLoading ? (
          <div className="empty">Loading your books...</div>
        ) : borrowedBooks.length === 0 ? (
          <div className="glass empty">You haven't borrowed any books yet.</div>
        ) : (
          <div className="grid">
            {borrowedBooks.map((book) => {
              const due = new Date(book.dueDate)
              const isOverdue = due.getTime() < Date.now()
              return (
                <article key={book.id} className="glass book-card">
                  <h3 className="book-title">{book.title}</h3>
                  <p className="book-author">by {book.author}</p>
                  <p className="helper">Borrowed: {new Date(book.borrowDate).toLocaleDateString()}</p>
                  <p className="helper">Due: {due.toLocaleDateString()} {isOverdue ? "(Overdue)" : "(On time)"}</p>
                  <button onClick={() => handleReturn(book.id)} className="btn">Return Book</button>
                </article>
              )
            })}
          </div>
        )}
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <header className="mb-8">
            <h1 className="text-4xl font-black tracking-tight text-gray-900">My Borrowed Books</h1>
            <p className="mt-2 text-gray-600">Track due dates and return your books quickly.</p>
          </header>

          {error && <div className="mb-4 rounded-lg bg-red-50 p-4 text-red-700">{error}</div>}

          {isLoading ? (
            <div className="py-12 text-center text-gray-600">Loading your books...</div>
          ) : borrowedBooks.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-300 bg-white py-12 text-center text-gray-600">
              You haven't borrowed any books yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {borrowedBooks.map((book) => {
                const due = new Date(book.dueDate)
                const isOverdue = due.getTime() < Date.now()

                return (
                  <article key={book.id} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                    <h3 className="mb-1 text-xl font-bold text-gray-900">{book.title}</h3>
                    <p className="mb-4 text-sm text-gray-600">by {book.author}</p>
                    <p className="mb-1 text-sm text-gray-500">
                      Borrowed: {new Date(book.borrowDate).toLocaleDateString()}
                    </p>
                    <p className={`mb-5 text-sm font-semibold ${isOverdue ? "text-red-600" : "text-emerald-600"}`}>
                      Due: {due.toLocaleDateString()} {isOverdue ? "(Overdue)" : "(On time)"}
                    </p>
                    <button
                      onClick={() => handleReturn(book.id)}
                      className="w-full rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white transition hover:bg-indigo-700"
                    >
                      Return Book
                    </button>
                  </article>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default MyBooks
