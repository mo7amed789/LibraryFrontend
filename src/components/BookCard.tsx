import type { Book } from "../types/Book"

type Props = {
  book: Book
  onBorrow?: (bookId: number) => void
}

function BookCard({ book, onBorrow }: Props) {
  const availableCopies = book.availableCopies ?? 1
  const canBorrow = availableCopies > 0

  return (
    <article className="group flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="mb-3 flex items-start justify-between gap-2">
        <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
          {book.genre || "General"}
        </span>
        <span className="text-xs text-gray-500">{book.publishedYear ?? "Classic"}</span>
      </div>

      <h3 className="mb-1 text-xl font-bold text-gray-900">{book.title}</h3>
      <p className="mb-3 text-sm font-medium text-gray-600">by {book.author}</p>
      <p className="mb-4 flex-1 text-sm text-gray-600">{book.description}</p>

      <div className="mb-4 flex items-center justify-between text-xs text-gray-500">
        <span>
          Availability: {availableCopies}/{book.totalCopies ?? availableCopies}
        </span>
        <span>⭐ {book.rating ?? "4.5"}</span>
      </div>

      <button
        disabled={!canBorrow}
        onClick={() => onBorrow?.(book.id)}
        className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-gray-300"
      >
        {canBorrow ? "Borrow Now" : "Unavailable"}
      </button>
    </article>
  )
}

export default BookCard
