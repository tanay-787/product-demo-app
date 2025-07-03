# Tourify Backend

This repository contains the backend for Tourify, a product tour creation and viewing application. It provides a robust API for managing tours, their steps, and annotations, along with analytics, insights, and media handling.

## Features

*   **Tour Management:** Create, read, update, and delete product tours and their associated steps and annotations.
*   **Public Tour Viewing:** Allows public access to published tours via a unique shareable URL.
*   **Analytics:** Track tour views and user interactions.
*   **Insights:** Provide data-driven insights on tour performance.
*   **Media Management:** Handle image and video uploads for tour steps.
*   **Authentication & Authorization:** Secure API endpoints using Neon Authorize (JWT-based authentication).
*   **Database Integration:** Utilizes Neon Postgres with Drizzle ORM for efficient data management.
*   **Input Validation:** Ensures data integrity with Zod schema validation.
*   **Error Handling:** Comprehensive error handling for robust API responses.

## Technologies Used

*   **Node.js & Express.js:** The core web framework for building RESTful APIs.
*   **TypeScript:** For type-safe and maintainable code.
*   **Neon Postgres:** A serverless PostgreSQL database.
*   **Drizzle ORM:** A modern TypeScript ORM for relational databases.
*   **Neon Authorize:** For JWT-based user authentication and authorization.
*   **Zod:** A TypeScript-first schema declaration and validation library.
*   **CORS:** Middleware for enabling Cross-Origin Resource Sharing.
*   **Multer:** Middleware for handling `multipart/form-data`, primarily used for file uploads.

## Setup and Installation

To set up the backend locally, follow these steps:

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Install dependencies:**
    ```bash
    pnpm install
    ```
    (If you don't have pnpm, install it using `npm install -g pnpm`)

3.  **Environment Variables:**
    Create a `.env` file in the `backend/` directory based on `.env.example`:
    ```
    DATABASE_URL="your_neon_postgres_database_url"
    JWKS_URL="your_neon_authorize_jwks_url"
    # Optional: Set a port if you don't want to use the default 3000
    # PORT=3001
    ```
    *   `DATABASE_URL`: Your connection string for the Neon PostgreSQL database.
    *   `JWKS_URL`: The JSON Web Key Set (JWKS) URL provided by Neon Authorize for verifying JWTs.

4.  **Database Migrations:**
    Generate and apply database migrations to set up your schema:
    ```bash
    pnpm run db:generate
    pnpm run db:migrate
    ```

5.  **Start the Development Server:**
    ```bash
    pnpm run dev
    ```
    The server will typically run on `http://localhost:3000`.

## API Endpoints

All authenticated endpoints require a valid JWT (JSON Web Token) provided in the `Authorization` header as a Bearer token:

`Authorization: Bearer <your_jwt_token>`

### 1. Health Check

*   `GET /api/health`
    *   **Description:** Checks the health of the API.
    *   **Authentication:** None
    *   **Response:**
        ```json
        { "status": "OK", "timestamp": "2024-01-01T12:00:00.000Z" }
        ```

### 2. Tour Management (`/api/tours`)

These endpoints are protected and require authentication.

*   `GET /api/tours`
    *   **Description:** Retrieve all tours belonging to the authenticated user.
*   `GET /api/tours/:id`
    *   **Description:** Retrieve a single tour by ID, including its steps and annotations.
*   `POST /api/tours`
    *   **Description:** Create a new tour.
    *   **Request Body Example:**
        ```json
        {
          "title": "My New Product Tour",
          "description": "An exciting tour to onboard users."
        }
        ```
*   `PATCH /api/tours/:id`
    *   **Description:** Update an existing tour's details or status.
    *   **Request Body Example (to update status):**
        ```json
        {
          "status": "published"
        }
        ```
*   `DELETE /api/tours/:id`
    *   **Description:** Delete a tour by ID.

#### Tour Steps (`/api/tours/:tourId/steps`)

*   `POST /api/tours/:tourId/steps`
    *   **Description:** Add a new step to a tour.
*   `PATCH /api/tours/:tourId/steps/:stepId`
    *   **Description:** Update an existing tour step.
*   `DELETE /api/tours/:tourId/steps/:stepId`
    *   **Description:** Delete a tour step.

#### Tour Sharing (`/api/tours/:tourId/share`)

*   `GET /api/tours/:tourId/share`
    *   **Description:** Get sharing information for a tour (e.g., public share ID).
*   `POST /api/tours/:tourId/share`
    *   **Description:** Create or update sharing settings for a tour (e.g., make it public).
    *   **Request Body Example:**
        ```json
        {
          "isPublic": true
        }
        ```

### 3. Public Tour Viewing (`/api/view`)

These endpoints are public and do not require authentication.

*   `GET /api/view/:id`
    *   **Description:** Retrieve a published tour by its public ID. Returns tour details, steps, and annotations.

### 4. Analytics (`/api/analytics`)

*   `POST /api/analytics/event`
    *   **Description:** Record an analytics event (e.g., tour view, step completion).
    *   **Authentication:** Authenticated or public depending on event type.
    *   **Request Body Example:**
        ```json
        {
          "tourId": "some_tour_id",
          "eventType": "tour_view",
          "userId": "optional_user_id",
          "data": { "platform": "web" }
        }
        ```

### 5. Insights (`/api/insights`)

These endpoints are protected and require authentication.

*   `GET /api/insights/tours`
    *   **Description:** Get aggregated insights across all user's tours.
*   `GET /api/insights/tours/:id`
    *   **Description:** Get detailed insights for a specific tour.

### 6. Media (`/api/media`)

These endpoints are protected and require authentication.

*   `POST /api/media/upload`
    *   **Description:** Upload image or video files for tour annotations.
    *   **Content-Type:** `multipart/form-data`
    *   **Request Body:** File upload (e.g., `image`, `video` fields)
    *   **Response:** Returns the URL of the uploaded media.

## Database Schema

The application uses the following main schema:

*   **`tours`**: Stores information about each product tour (e.g., `id`, `title`, `description`, `status`).
*   **`tourSteps`**: Stores individual steps for each tour, linked by `tourId` (e.g., `id`, `stepOrder`, `imageUrl`, `videoUrl`, `description`).
*   **`annotations`**: Stores interactive annotations for each tour step, linked by `stepId` (e.g., `id`, `type`, `x`, `y`, `width`, `height`, `content`).
*   **`tourShares`**: Stores public sharing information for tours (e.g., `id`, `tourId`, `isPublic`).
*   **`analyticsEvents`**: Records various user interactions and tour views.

Detailed schema definitions can be found in `backend/db/schema/product-tours.ts`.

## Error Handling

The backend includes a centralized error handling middleware to catch and process errors. In development mode, it provides detailed error messages, while in production, it provides generic messages for security.

## Development Scripts

*   `pnpm dev`: Starts the development server with `ts-node-dev` for hot-reloading.
*   `pnpm build`: Compiles TypeScript to JavaScript for production deployment.
*   `pnpm start`: Starts the compiled Node.js application (for production).
*   `pnpm db:generate`: Generates Drizzle migrations based on schema changes.
*   `pnpm db:migrate`: Runs pending Drizzle database migrations.
*   `pnpm db:seed`: (If implemented) Seeds the database with sample data for development/testing.

## Contributing

Contributions are welcome! Please ensure you follow the existing code style and commit message guidelines. For major changes, please open an issue first to discuss what you would like to change.
