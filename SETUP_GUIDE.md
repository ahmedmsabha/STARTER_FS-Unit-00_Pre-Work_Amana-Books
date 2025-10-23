# Comprehensive Setup Guide for the Project

## Project Overview
This project is a web application built using Next.js. It includes features for managing books, a shopping cart, and user reviews.

## Prerequisites
- Node.js (version 18 or higher)
- npm (Node package manager)
- MongoDB database (connection string required)

## Environment Setup
1. **Environment Variables**
   Create a `.env.local` file in the root directory with your MongoDB connection string:
   ```bash
   DATABASE_MONGODB_URI="your-mongodb-connection-string"
   ```

## Project Setup
1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. **Install Dependencies**
   Run the following command to install all required dependencies:
   ```bash
   npm install
   ```

3. **Seed the Database**
   To seed the database with initial data, run:
   ```bash
   npm run seed
   ```
   This will:
   - Connect to your MongoDB database
   - Clear existing data
   - Insert 46 sample books
   - Insert 60 sample reviews
   - Create necessary indexes

4. **Run the Development Server**
   Start the development server with:
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:3000`.

## Project Structure
- **src/**: Contains the main application code.
  - **app/**: Application components and pages.
  - **lib/**: Library files, including database connection.
  - **models/**: Mongoose models for MongoDB.
  - **scripts/**: Scripts for seeding the database.

## Database Configuration
The application uses the `DATABASE_MONGODB_URI` environment variable for database connection. If not found, it falls back to `MONGODB_URI`.

## Troubleshooting
- If you encounter module loading errors, ensure you're using Node.js version 18 or higher
- Make sure your MongoDB connection string is properly formatted in `.env.local`
- Verify that your MongoDB cluster is accessible and accepting connections

## Additional Information
- For more details on the project, refer to the `README.md` file.
- To contribute, please follow the guidelines outlined in the repository.

## Funding
If you would like to support the project, run:
```bash
npm fund
```