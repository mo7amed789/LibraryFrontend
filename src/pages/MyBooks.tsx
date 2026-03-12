import { useEffect, useState } from "react"
import { Navigate } from "react-router-dom"
import { getBorrowedBooks, returnBook, type BorrowedBook } from "../api/borrowApi"
import Navbar from "../components/Navbar"
import { useAuth } from "../context/AuthContext"

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
                  <p className="helper">
                    Due: {due.toLocaleDateString()} {isOverdue ? "(Overdue)" : "(On time)"}
                  </p>
                  <button onClick={() => handleReturn(book.id)} className="btn">
                    Return Book
                  </button>
                </article>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}

export default MyBooks
