import BookCard from '@/components/BookCard'
import Hero from '@/components/Hero'
import { getAllBooks } from '@/lib/actions/book.actions';

export default async function  Page()  {
  const bookResult = await getAllBooks();
  const books = bookResult.success ? bookResult.data ?? [] : [];

  return (
    <main className='wrapper container'>
      <Hero />

       <div className="library-books-grid px-4">
            {books.map((book) =>(<BookCard key={book._id} title={book.title} author={book.author}  coverURL={book.coverURL}  slug={book.slug} />))}
      </div>
    </main>
  )
}