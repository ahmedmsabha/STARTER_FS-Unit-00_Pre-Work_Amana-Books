// src/app/api/books/route.ts
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Book from '@/models/Book';

// GET /api/books - List books with optional search, filter, sort, and pagination
// Query params:
// - q: string (search in title or author)
// - genre: string (exact match on a single genre)
// - inStock: 'true' | 'false'
// - minRating: number (0-5)
// - sortBy: 'title' | 'author' | 'datePublished' | 'rating' | 'reviewCount' | 'price'
// - sortOrder: 'asc' | 'desc'
// - page: number (>=1)
// - limit: number (1-100)
export async function GET(request: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);

    const q = (searchParams.get('q') || '').trim().toLowerCase();
    const genre = (searchParams.get('genre') || '').trim();
    const inStockParam = searchParams.get('inStock');
    const minRating = Number.isNaN(Number(searchParams.get('minRating')))
      ? undefined
      : Number(searchParams.get('minRating'));
    const sortBy = (searchParams.get('sortBy') || 'title') as
      | 'title'
      | 'author'
      | 'datePublished'
      | 'rating'
      | 'reviewCount'
      | 'price';
    const sortOrder = (searchParams.get('sortOrder') || 'asc') as 'asc' | 'desc';
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limitRaw = parseInt(searchParams.get('limit') || '10', 10);
    const limit = Math.min(100, Math.max(1, Number.isNaN(limitRaw) ? 10 : limitRaw));

    // Build query filter
    const filter: any = {};

    // Text search
    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: 'i' } },
        { author: { $regex: q, $options: 'i' } },
      ];
    }

    // Genre filter
    if (genre) {
      filter.genre = genre;
    }

    // Stock filter
    if (inStockParam !== null) {
      filter.inStock = inStockParam === 'true';
    }

    // Rating filter
    if (typeof minRating === 'number') {
      filter.rating = { $gte: minRating };
    }

    // Build sort object
    const sort: any = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute query
    const [books, total] = await Promise.all([
      Book.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      Book.countDocuments(filter),
    ]);

    const totalPages = Math.max(1, Math.ceil(total / limit));

    return NextResponse.json({
      data: books,
      page,
      limit,
      total,
      totalPages,
      params: {
        q: q || undefined,
        genre: genre || undefined,
        inStock: inStockParam === null ? undefined : inStockParam === 'true',
        minRating,
        sortBy,
        sortOrder,
      },
    });
  } catch (err) {
    console.error('Error fetching books:', err);
    return NextResponse.json(
      { error: 'Failed to fetch books' },
      { status: 500 },
    );
  }
}

// POST /api/books - Create a new book
export async function POST(request: Request) {
  try {
    await connectDB();

    const body = await request.json();
    const book = await Book.create(body);

    return NextResponse.json(
      { success: true, data: book },
      { status: 201 }
    );
  } catch (err) {
    console.error('Error creating book:', err);
    return NextResponse.json(
      { error: 'Failed to create book' },
      { status: 500 },
    );
  }
}
