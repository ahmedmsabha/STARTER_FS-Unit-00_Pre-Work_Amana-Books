import mongoose, { Schema, Model } from 'mongoose';

export interface ICartItem {
    id: string;
    bookId: string;
    quantity: number;
    addedAt: string;
}

export interface ICart {
    userId: string;
    items: ICartItem[];
    createdAt?: Date;
    updatedAt?: Date;
}

const CartItemSchema = new Schema<ICartItem>(
    {
        id: {
            type: String,
            required: true,
        },
        bookId: {
            type: String,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
        },
        addedAt: {
            type: String,
            required: true,
        },
    },
    { _id: false }
);

const CartSchema = new Schema<ICart>(
    {
        userId: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        items: {
            type: [CartItemSchema],
            default: [],
        },
    },
    {
        timestamps: true,
    }
);

// Prevent model recompilation in development
const Cart: Model<ICart> =
    mongoose.models.Cart || mongoose.model<ICart>('Cart', CartSchema);

export default Cart;
