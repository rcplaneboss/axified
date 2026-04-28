import BookCard from '@/components/BookCard'
import Hero from '@/components/Hero'
import { sampleBooks } from '@/lib/constants'

export default function Page() {
  return (
    <main className='wrapper container'>
      <Hero />

       <div className="library-books-grid px-4">
            {sampleBooks.map((book) =>(<BookCard key={book._id} title={book.title} author={book.author}  coverURL={book.coverURL}  slug={book.slug} />))}
      </div>
    </main>
  )
}