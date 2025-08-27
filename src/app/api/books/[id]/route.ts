// src/app/api/books/[id]/route.ts
import { NextResponse } from 'next/server';
import { books } from '../../../data/books';

// GET /api/books/[id] - Return a single book by id
export async function GET(
  _request: Request,
  context: { params: { id: string } },
) {
  try {
    const { id } = context.params;
    const book = books.find((b) => b.id === id);
    if (!book) {
      return NextResponse.json(
        { error: 'Book not found' },
        { status: 404 },
      );
    }
    return NextResponse.json(book);
  } catch (err) {
    console.error('Error fetching book:', err);
    return NextResponse.json(
      { error: 'Failed to fetch book' },
      { status: 500 },
    );
  }
}
