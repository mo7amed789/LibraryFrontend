import type { Book } from "../types/Book"

type Props = {
  book: Book
  onBorrow?: (bookId: number) => void
}

function BookCard({ book, onBorrow }: Props) {
  const availableCopies = book.availableCopies ?? 1
  const canBorrow = availableCopies > 0

  return (
    <article className="glass book-card">
      <div className="meta">
        <span>{book.genre || "General"}</span>
        <span>{book.publishedYear ?? "Classic"}</span>
      </div>
      <h3 className="book-title">{book.title}</h3>
      <p className="book-author">by {book.author}</p>
      <p className="book-desc">{book.description}</p>
      <div className="meta">
        <span>Availability: {availableCopies}/{book.totalCopies ?? availableCopies}</span>
        <span>⭐ {book.rating ?? "4.5"}</span>
      </div>
      <button disabled={!canBorrow} onClick={() => onBorrow?.(book.id)} className="btn">
        {canBorrow ? "Borrow Now" : "Unavailable"}
      </button>
    </article>
  )
}

export default BookCard
