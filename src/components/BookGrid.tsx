import type { Book } from "../types/Book"
import BookCard from "./BookCard"

interface BookGridProps {
  books: Book[]
  onBorrow?: (bookId: number) => void
}

function BookGrid({ books, onBorrow }: BookGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {books.map((book) => (
        <div key={book.id} onClick={() => onBorrow?.(book.id)}>
          <BookCard book={book} />
        </div>
      ))}
    </div>
  )
}

export default BookGrid
