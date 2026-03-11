import type { Book } from "../types/Book"
import BookCard from "./BookCard"

interface BookGridProps {
  books: Book[]
  onBorrow?: (bookId: number) => void
}

function BookGrid({ books, onBorrow }: BookGridProps) {
  return (
    <div className="grid">
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {books.map((book) => (
        <BookCard key={book.id} book={book} onBorrow={onBorrow} />
      ))}
    </div>
  )
}

export default BookGrid
