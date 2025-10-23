import mongoose, { Schema, Model } from 'mongoose';

export interface IReview {
    id: string;
    bookId: string;
    author: string;
    rating: number;
    title: string;
    comment: string;
    timestamp: string;
    verified: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

const ReviewSchema = new Schema<IReview>(
    {
        id: {
            type: String,
            required: true,
            unique: true,
        },
        bookId: {
            type: String,
            required: true,
            index: true,
        },
        author: {
            type: String,
            required: true,
            trim: true,
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        comment: {
            type: String,
            required: true,
        },
        timestamp: {
            type: String,
            required: true,
        },
        verified: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// Prevent model recompilation in development
const Review: Model<IReview> =
    mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema);

export default Review;
