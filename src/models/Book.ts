import mongoose, { Schema, Model } from 'mongoose';

export interface IBook {
    id: string;
    title: string;
    author: string;
    description: string;
    price: number;
    image: string;
    isbn: string;
    genre: string[];
    tags: string[];
    datePublished: string;
    pages: number;
    language: string;
    publisher: string;
    rating: number;
    reviewCount: number;
    inStock: boolean;
    featured: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

const BookSchema = new Schema<IBook>(
    {
        id: {
            type: String,
            required: true,
            unique: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
            index: true,
        },
        author: {
            type: String,
            required: true,
            trim: true,
            index: true,
        },
        description: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
        image: {
            type: String,
            required: true,
        },
        isbn: {
            type: String,
            required: true,
            unique: true,
        },
        genre: {
            type: [String],
            required: true,
            index: true,
        },
        tags: {
            type: [String],
            default: [],
        },
        datePublished: {
            type: String,
            required: true,
        },
        pages: {
            type: Number,
            required: true,
            min: 1,
        },
        language: {
            type: String,
            required: true,
            default: 'English',
        },
        publisher: {
            type: String,
            required: true,
        },
        rating: {
            type: Number,
            required: true,
            min: 0,
            max: 5,
            default: 0,
            index: true,
        },
        reviewCount: {
            type: Number,
            required: true,
            min: 0,
            default: 0,
        },
        inStock: {
            type: Boolean,
            required: true,
            default: true,
            index: true,
        },
        featured: {
            type: Boolean,
            required: true,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// Create text index for search
BookSchema.index({ title: 'text', author: 'text', description: 'text' });

// Prevent model recompilation in development
const Book: Model<IBook> =
    mongoose.models.Book || mongoose.model<IBook>('Book', BookSchema);

export default Book;
