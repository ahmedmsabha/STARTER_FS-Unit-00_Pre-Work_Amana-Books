// src/app/api/books/[id]/route.ts
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Book from '@/models/Book';

// GET /api/books/[id] - Return a single book by id
export async function GET(
  _request: Request,
  context: { params: { id: string } },
) {
  try {
    await connectDB();

    const { id } = context.params;
    const book = await Book.findOne({ id }).lean();

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

// PUT /api/books/[id] - Update a book by id
export async function PUT(
  request: Request,
  context: { params: { id: string } },
) {
  try {
    await connectDB();

    const { id } = context.params;
    const body = await request.json();

    const book = await Book.findOneAndUpdate(
      { id },
      { $set: body },
      { new: true, runValidators: true }
    ).lean();

    if (!book) {
      return NextResponse.json(
        { error: 'Book not found' },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: book });
  } catch (err) {
    console.error('Error updating book:', err);
    return NextResponse.json(
      { error: 'Failed to update book' },
      { status: 500 },
    );
  }
}

// DELETE /api/books/[id] - Delete a book by id
export async function DELETE(
  _request: Request,
  context: { params: { id: string } },
) {
  try {
    await connectDB();

    const { id } = context.params;
    const book = await Book.findOneAndDelete({ id }).lean();

    if (!book) {
      return NextResponse.json(
        { error: 'Book not found' },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: book });
  } catch (err) {
    console.error('Error deleting book:', err);
    return NextResponse.json(
      { error: 'Failed to delete book' },
      { status: 500 },
    );
  }
}
