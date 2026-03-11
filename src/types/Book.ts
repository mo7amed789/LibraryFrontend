export interface Book {
  id: number
  title: string
  author: string
  description: string
  genre?: string
  publishedYear?: number
  availableCopies?: number
  totalCopies?: number
  rating?: number
}
