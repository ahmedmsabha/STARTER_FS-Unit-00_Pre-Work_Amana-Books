# Amana Bookstore - MongoDB Setup Guide

This application now uses MongoDB Atlas as the database backend with Mongoose ODM. All data is fetched from the database via serverless API routes.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account (if you don't have one)
3. Create a new cluster (M0 Free Tier is sufficient)
4. Create a database user:
   - Go to "Database Access"
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Set username and password (save these!)
   - Grant "Read and write to any database" privileges
5. Whitelist your IP address:
   - Go to "Network Access"
   - Click "Add IP Address"
   - For development, you can use `0.0.0.0/0` (allow from anywhere)
   - For production, use your specific IP
6. Get your connection string:
   - Go to "Database" → "Connect"
   - Choose "Connect your application"
   - Copy the connection string

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your MongoDB connection string:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/amana-bookstore?retryWrites=true&w=majority
```

Replace:
- `<username>` with your database username
- `<password>` with your database password
- `<cluster>` with your cluster name (e.g., `cluster0.abc123`)

**Example:**
```env
MONGODB_URI=mongodb+srv://myuser:mypassword123@cluster0.abc123.mongodb.net/amana-bookstore?retryWrites=true&w=majority
```

### 4. Seed the Database

Populate your MongoDB database with initial book and review data:

```bash
npm run seed
```

You should see output like:
```
🔄 Connecting to MongoDB...
✅ Connected to MongoDB
🔄 Clearing existing data...
✅ Cleared existing data
🔄 Seeding books...
✅ Seeded 46 books
🔄 Seeding reviews...
✅ Seeded 60 reviews
🔄 Creating indexes...
✅ Created indexes
🎉 Database seeding completed successfully!
```

### 5. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
src/
├── app/
│   ├── api/                    # Serverless API routes
│   │   ├── books/
│   │   │   ├── route.ts       # GET /api/books, POST /api/books
│   │   │   └── [id]/
│   │   │       └── route.ts   # GET/PUT/DELETE /api/books/:id
│   │   ├── reviews/
│   │   │   └── route.ts       # GET /api/reviews, POST /api/reviews
│   │   └── cart/
│   │       └── route.ts       # Cart management endpoints
│   ├── book/[id]/
│   │   └── page.tsx           # Book detail page (fetches from API)
│   ├── cart/
│   │   └── page.tsx           # Cart page
│   ├── components/            # Reusable components
│   ├── data/                  # Original local data (now unused)
│   ├── page.tsx              # Homepage (fetches from API)
│   └── types/                # TypeScript type definitions
├── lib/
│   └── mongoose.ts           # MongoDB connection utility
├── models/                    # Mongoose schemas and models
│   ├── Book.ts
│   ├── Review.ts
│   └── Cart.ts
└── scripts/
    └── seedDatabase.ts       # Database seeding script
```

## 🔌 API Endpoints

### Books
- **GET** `/api/books` - List all books
  - Query params: `q`, `genre`, `inStock`, `minRating`, `sortBy`, `sortOrder`, `page`, `limit`
  - Example: `/api/books?genre=Physics&sortBy=rating&sortOrder=desc&limit=20`
- **POST** `/api/books` - Create a new book
- **GET** `/api/books/:id` - Get a single book by ID
- **PUT** `/api/books/:id` - Update a book
- **DELETE** `/api/books/:id` - Delete a book

### Reviews
- **GET** `/api/reviews?bookId=1` - Get reviews for a specific book
- **POST** `/api/reviews` - Create a new review

### Cart
- **GET** `/api/cart?userId=guest` - Get cart items for a user
- **POST** `/api/cart` - Update entire cart
- **PUT** `/api/cart` - Update item quantity
- **DELETE** `/api/cart?itemId=123` - Remove item from cart

## 🧪 Testing the API

You can test the API using curl, Postman, or your browser:

```bash
# Get all books
curl http://localhost:3000/api/books

# Search for physics books
curl "http://localhost:3000/api/books?q=physics&limit=5"

# Get a specific book
curl http://localhost:3000/api/books/1

# Get reviews for a book
curl http://localhost:3000/api/reviews?bookId=1
```

## 🔧 Database Models

### Book Model
- `id`: Unique identifier
- `title`: Book title
- `author`: Author name
- `description`: Book description
- `price`: Price in USD
- `isbn`: ISBN number
- `genre`: Array of genres
- `rating`: Average rating (0-5)
- `reviewCount`: Number of reviews
- `inStock`: Availability status
- `featured`: Featured book flag

### Review Model
- `id`: Unique identifier
- `bookId`: Reference to book
- `author`: Reviewer name
- `rating`: Rating (1-5)
- `title`: Review title
- `comment`: Review text
- `timestamp`: Review date/time
- `verified`: Verified purchase flag

### Cart Model
- `userId`: User identifier
- `items`: Array of cart items
  - `id`: Item ID
  - `bookId`: Reference to book
  - `quantity`: Number of items
  - `addedAt`: Timestamp

## 🎯 Features

✅ **Full API Integration** - All pages fetch data from MongoDB via API routes
✅ **Serverless Architecture** - API routes are serverless functions
✅ **Connection Pooling** - Mongoose connection reuse for better performance
✅ **Database Indexes** - Text search and query optimization
✅ **Error Handling** - Comprehensive error handling in API routes
✅ **TypeScript** - Full type safety throughout the application
✅ **Loading States** - User-friendly loading indicators
✅ **Search & Filtering** - Advanced book search and filtering capabilities

## 🚨 Troubleshooting

### Connection Issues

If you see "Failed to fetch books" or connection errors:

1. **Check MongoDB URI**: Ensure `.env.local` has the correct connection string
2. **Check IP Whitelist**: Make sure your IP is whitelisted in MongoDB Atlas Network Access
3. **Check Database User**: Verify username and password are correct
4. **Check Network**: Ensure you have internet connectivity

### Seed Script Fails

If `npm run seed` fails:

1. Make sure `.env.local` exists and has valid `MONGODB_URI`
2. Check that your MongoDB user has write permissions
3. Verify the database name in the connection string

### No Data Showing

If the app runs but shows no books:

1. Run `npm run seed` to populate the database
2. Check browser console for API errors
3. Verify API routes are responding: `curl http://localhost:3000/api/books`

## 📝 Local Data Files

The original local data files in `src/app/data/` are no longer used by the application. The app now fetches all data from MongoDB. You can safely delete these files if desired, but they're kept for reference and used by the seed script.

## 🔐 Security Notes

- Never commit `.env.local` to version control
- Use environment-specific connection strings
- For production, use specific IP whitelisting (not `0.0.0.0/0`)
- Consider implementing authentication for write operations
- Use MongoDB Atlas backup features for production data

## 📚 Additional Resources

- [MongoDB Atlas Documentation](https://www.mongodb.com/docs/atlas/)
- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Next.js Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)

## 🆘 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review MongoDB Atlas logs
3. Check browser console for errors
4. Verify API responses with curl/Postman

Happy coding! 🚀
