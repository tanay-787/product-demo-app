# Express + Neon Backend with TypeScript

A robust Express.js backend application using Neon Postgres database with Drizzle ORM and Neon Authorize for authentication.

## Features

- 🚀 Express.js with TypeScript
- 🗄️ Neon Postgres database with Drizzle ORM
- 🔐 Neon Authorize for JWT-based authentication
- ✅ Input validation with Zod
- 🔒 Secure middleware (Helmet, CORS)
- 📝 Comprehensive error handling

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment setup:**
   ```bash
   cp .env.example .env
   ```
   Fill in your Neon database URLs and JWKS URL.

3. **Generate and run migrations:**
   ```bash
   npm run db:generate
   npm run db:migrate
   ```

4. **Seed the database (optional):**
   ```bash
   npm run db:seed
   ```

5. **Start development server:**
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
All API endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### User Endpoints

#### POST /api/users/:id
Get a specific user's information by their ID.

**Request:**
```bash
curl -X POST http://localhost:3000/api/users/123e4567-e89b-12d3-a456-426614174000 \
  -H "Authorization: Bearer <your-jwt-token>"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "john.doe@example.com",
    "name": "John Doe",
    "avatar": "https://avatar.vercel.sh/john",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "profile": {
      "bio": "Full-stack developer passionate about TypeScript and React",
      "location": "San Francisco, CA",
      "website": "https://johndoe.dev",
      "company": "Tech Corp",
      "jobTitle": "Senior Developer"
    }
  }
}
```

#### GET /api/users/me
Get the current authenticated user's information.

## Security

This application implements security at multiple levels:

1. **JWT Authentication:** All requests require valid JWT tokens
2. **Input Validation:** Request validation using Zod schemas
3. **Secure Headers:** Helmet middleware for security headers
4. **CORS Protection:** Configurable CORS policies

## Database Schema

The application uses two main tables:
- `users`: Core user information
- `user_profiles`: Extended user profile data

## Development

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:generate` - Generate database migrations
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database with sample data
