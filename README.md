This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

### API Overview

- `GET /api/books` — List books with optional search, filters, sorting and pagination.

  - Query parameters:
    - `q`: search string (matches `title` or `author`)
    - `genre`: exact genre to include
    - `inStock`: `true` or `false`
    - `minRating`: number `0-5`
    - `sortBy`: `title | author | datePublished | rating | reviewCount | price`
    - `sortOrder`: `asc | desc`
    - `page`: page number (>= 1)
    - `limit`: items per page (1-100)
  - Response shape:
    ```json
    {
      "data": [
        /* Book[] */
      ],
      "page": 1,
      "limit": 10,
      "total": 42,
      "totalPages": 5,
      "params": {
        "q": "physics",
        "genre": "Astronomy",
        "inStock": true,
        "minRating": 4,
        "sortBy": "rating",
        "sortOrder": "desc"
      }
    }
    ```

- `GET /api/books/[id]` — Fetch a single book by `id`.
  - `404` if not found.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
