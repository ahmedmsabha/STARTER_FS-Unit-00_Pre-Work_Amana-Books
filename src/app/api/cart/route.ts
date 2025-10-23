// src/app/api/cart/route.ts
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Cart from '@/models/Cart';

// GET /api/cart - Get cart items
// Query params:
// - userId: string (defaults to 'guest' if not provided)
export async function GET(request: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'guest';

    const cart = await Cart.findOne({ userId }).lean();

    return NextResponse.json({
      success: true,
      data: cart?.items || [],
    });
  } catch (err) {
    console.error('Error fetching cart:', err);
    return NextResponse.json(
      { error: 'Failed to fetch cart' },
      { status: 500 }
    );
  }
}

// POST /api/cart - Add item to cart or update entire cart
export async function POST(request: Request) {
  try {
    await connectDB();

    const body = await request.json();
    const userId = body.userId || 'guest';

    // Upsert the cart (create if doesn't exist, update if exists)
    const cart = await Cart.findOneAndUpdate(
      { userId },
      {
        $set: {
          items: body.items,
        },
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    ).lean();

    return NextResponse.json({
      success: true,
      data: cart,
    });
  } catch (err) {
    console.error('Error updating cart:', err);
    return NextResponse.json(
      { error: 'Failed to update cart' },
      { status: 500 }
    );
  }
}

// PUT /api/cart - Update cart item quantity
export async function PUT(request: Request) {
  try {
    await connectDB();

    const body = await request.json();
    const userId = body.userId || 'guest';
    const { bookId, quantity } = body;

    if (!bookId || typeof quantity !== 'number') {
      return NextResponse.json(
        { error: 'bookId and quantity are required' },
        { status: 400 }
      );
    }

    const cart = await Cart.findOneAndUpdate(
      { userId, 'items.bookId': bookId },
      {
        $set: { 'items.$.quantity': quantity },
      },
      { new: true }
    ).lean();

    if (!cart) {
      return NextResponse.json(
        { error: 'Cart or item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: cart,
    });
  } catch (err) {
    console.error('Error updating cart item:', err);
    return NextResponse.json(
      { error: 'Failed to update cart item' },
      { status: 500 }
    );
  }
}

// DELETE /api/cart - Remove item from cart or clear entire cart
export async function DELETE(request: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'guest';
    const itemId = searchParams.get('itemId');

    if (itemId) {
      // Remove specific item
      const cart = await Cart.findOneAndUpdate(
        { userId },
        {
          $pull: { items: { id: itemId } },
        },
        { new: true }
      ).lean();

      return NextResponse.json({
        success: true,
        data: cart,
      });
    } else {
      // Clear entire cart
      const cart = await Cart.findOneAndUpdate(
        { userId },
        {
          $set: { items: [] },
        },
        { new: true }
      ).lean();

      return NextResponse.json({
        success: true,
        data: cart,
      });
    }
  } catch (err) {
    console.error('Error removing cart item:', err);
    return NextResponse.json(
      { error: 'Failed to remove item from cart' },
      { status: 500 }
    );
  }
}