import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Book from '../models/Book';
import Review from '../models/Review';
import { books } from '../app/data/books';
import { reviews } from '../app/data/reviews';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function seedDatabase() {
    try {
        const MONGODB_URI = process.env.DATABASE_MONGODB_URI || process.env.MONGODB_URI;

        if (!MONGODB_URI) {
            throw new Error('DATABASE_MONGODB_URI (or MONGODB_URI) is not defined in environment variables');
        }

        console.log('🔄 Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing data
        console.log('🔄 Clearing existing data...');
        await Book.deleteMany({});
        await Review.deleteMany({});
        console.log('✅ Cleared existing data');

        // Seed books
        console.log('🔄 Seeding books...');
        const insertedBooks = await Book.insertMany(books);
        console.log(`✅ Seeded ${insertedBooks.length} books`);

        // Seed reviews
        console.log('🔄 Seeding reviews...');
        const insertedReviews = await Review.insertMany(reviews);
        console.log(`✅ Seeded ${insertedReviews.length} reviews`);

        // Create indexes
        console.log('🔄 Creating indexes...');
        await Book.createIndexes();
        await Review.createIndexes();
        console.log('✅ Created indexes');

        console.log('\n🎉 Database seeding completed successfully!');
        console.log(`📚 Total books: ${insertedBooks.length}`);
        console.log(`⭐ Total reviews: ${insertedReviews.length}`);

        // Show sample data
        console.log('\n📖 Sample book:');
        console.log(JSON.stringify(insertedBooks[0], null, 2));

    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    } finally {
        await mongoose.connection.close();
        console.log('\n👋 Database connection closed');
    }
}

// Run the seed function
seedDatabase();
