// src/app/api/reviews/route.ts
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Review from '@/models/Review';

// GET /api/reviews - Get all reviews or reviews for a specific book
// Query params:
// - bookId: string (optional, filter reviews by book ID)
export async function GET(request: Request) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const bookId = searchParams.get('bookId');

        const filter = bookId ? { bookId } : {};
        const reviews = await Review.find(filter).sort({ timestamp: -1 }).lean();

        return NextResponse.json({
            success: true,
            data: reviews,
        });
    } catch (err) {
        console.error('Error fetching reviews:', err);
        return NextResponse.json(
            { error: 'Failed to fetch reviews' },
            { status: 500 },
        );
    }
}

// POST /api/reviews - Create a new review
export async function POST(request: Request) {
    try {
        await connectDB();

        const body = await request.json();

        // Generate a unique ID for the review
        const reviewId = `review-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        const reviewData = {
            id: reviewId,
            ...body,
            timestamp: new Date().toISOString(),
            verified: false,
        };

        const review = await Review.create(reviewData);

        return NextResponse.json(
            { success: true, data: review },
            { status: 201 }
        );
    } catch (err) {
        console.error('Error creating review:', err);
        return NextResponse.json(
            { error: 'Failed to create review' },
            { status: 500 },
        );
    }
}
