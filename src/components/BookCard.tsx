import type{ Book } from "../types/Book"

type Props = {
  book: Book
}

function BookCard({ book }: Props) {

  return (

    <div className="book-card">

      <h3>{book.title}</h3>

      <p>{book.author}</p>

      <button>
        Borrow
      </button>

    </div>

  )

}

export default BookCard