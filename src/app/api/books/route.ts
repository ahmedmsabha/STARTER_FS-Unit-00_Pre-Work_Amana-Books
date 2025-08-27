// src/app/api/books/route.ts
import { NextResponse } from 'next/server';
import { books } from '../../data/books';

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
    const { searchParams } = new URL(request.url);

    const q = (searchParams.get('q') || '')
      .trim()
      .toLowerCase();
    const genre = (searchParams.get('genre') || '').trim();
    const inStockParam = searchParams.get('inStock');
    const minRating = Number.isNaN(
      Number(searchParams.get('minRating')),
    )
      ? undefined
      : Number(searchParams.get('minRating'));
    const sortBy = (searchParams.get('sortBy') ||
      'title') as
      | 'title'
      | 'author'
      | 'datePublished'
      | 'rating'
      | 'reviewCount'
      | 'price';
    const sortOrder = (searchParams.get('sortOrder') ||
      'asc') as 'asc' | 'desc';
    const page = Math.max(
      1,
      parseInt(searchParams.get('page') || '1', 10),
    );
    const limitRaw = parseInt(
      searchParams.get('limit') || '10',
      10,
    );
    const limit = Math.min(
      100,
      Math.max(1, Number.isNaN(limitRaw) ? 10 : limitRaw),
    );

    // Filter
    let results = books.filter((book) => {
      const matchesSearch = q
        ? book.title.toLowerCase().includes(q) ||
          book.author.toLowerCase().includes(q)
        : true;
      const matchesGenre = genre
        ? book.genre.includes(genre)
        : true;
      const matchesInStock =
        inStockParam === null
          ? true
          : inStockParam === 'true'
          ? book.inStock
          : !book.inStock;
      const matchesMinRating =
        typeof minRating === 'number'
          ? book.rating >= minRating
          : true;
      return (
        matchesSearch &&
        matchesGenre &&
        matchesInStock &&
        matchesMinRating
      );
    });

    // Sort
    const sorted = [...results].sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'author':
          comparison = a.author.localeCompare(b.author);
          break;
        case 'datePublished':
          comparison =
            new Date(a.datePublished).getTime() -
            new Date(b.datePublished).getTime();
          break;
        case 'rating':
          comparison = a.rating - b.rating;
          break;
        case 'reviewCount':
          comparison = a.reviewCount - b.reviewCount;
          break;
        case 'price':
          comparison = a.price - b.price;
          break;
        default:
          comparison = 0;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    // Paginate
    const total = sorted.length;
    const totalPages = Math.max(
      1,
      Math.ceil(total / limit),
    );
    const safePage = Math.min(page, totalPages);
    const startIndex = (safePage - 1) * limit;
    const endIndex = startIndex + limit;
    const data = sorted.slice(startIndex, endIndex);

    return NextResponse.json({
      data,
      page: safePage,
      limit,
      total,
      totalPages,
      params: {
        q: q || undefined,
        genre: genre || undefined,
        inStock:
          inStockParam === null
            ? undefined
            : inStockParam === 'true',
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

// Future implementation notes:
// - Connect to a database (e.g., PostgreSQL, MongoDB)
// - Add authentication middleware for admin operations
// - Implement pagination for large datasets
// - Add filtering and search query parameters
// - Include proper error handling and logging
// - Add rate limiting for API protection
// - Implement caching strategies for better performance

// Example future database integration:
// import { db } from '@/lib/database';
//
// export async function GET(request: Request) {
//   const { searchParams } = new URL(request.url);
//   const page = parseInt(searchParams.get('page') || '1');
//   const limit = parseInt(searchParams.get('limit') || '10');
//   const genre = searchParams.get('genre');
//
//   try {
//     const books = await db.books.findMany({
//       where: genre ? { genre: { contains: genre } } : {},
//       skip: (page - 1) * limit,
//       take: limit,
//     });
//
//     return NextResponse.json(books);
//   } catch (error) {
//     return NextResponse.json(
//       { error: 'Database connection failed' },
//       { status: 500 }
//     );
//   }
// }
