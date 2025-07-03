# Tourify: Product Tour Creation and Viewing Platform

Tourify is a comprehensive platform designed to empower businesses and individuals to create, manage, and share interactive product tours. It provides a seamless experience for showcasing product features, guiding users, and collecting valuable insights into user engagement.

Built as a full-stack application, Tourify consists of a modern React-based frontend and a robust Node.js Express backend, leveraging the power of serverless Postgres with Drizzle ORM and secure authentication through Neon Authorize.

## Features

### Tour Creation & Management
*   **Intuitive Editor:** Create product tours with rich media (images, videos) and interactive annotations.
*   **Step-by-Step Guidance:** Define a sequence of steps to guide users through your product.
*   **Status Control:** Manage tour lifecycle with `draft`, `published`, and `private` statuses.
*   **Sharing Options:** Generate unique public URLs for published tours.

### Tour Viewing
*   **Interactive Viewer:** A dedicated interface for users to experience product tours.
*   **Responsive Design:** Tours are viewable across various devices.

### Data & Analytics
*   **User Authentication:** Secure access to tour creation and management.
*   **Engagement Tracking:** Record analytics events like tour views and step completions.
*   **Performance Insights:** Gain insights into how users interact with your tours.

### Robust Backend
*   **RESTful API:** A well-structured API for all tour-related operations.
*   **Secure Authentication:** JWT-based authentication powered by Neon Authorize.
*   **Data Validation:** Ensures data integrity with Zod schema validation.
*   **File Uploads:** Handle media (images, videos) for tour annotations.

## Technologies Used

### Frontend
*   **React:** JavaScript library for building user interfaces.
*   **Vite:** Fast build tool for modern web projects.
*   **Shadcn/ui:** Reusable UI components built with Radix UI and Tailwind CSS.
*   **TypeScript:** Type-safe JavaScript development.
*   **Tailwind CSS:** Utility-first CSS framework.
*   **React Router DOM:** For client-side routing.
*   **TanStack Query (React Query):** For data fetching and state management.
*   **Motion/React (Framer Motion):** For smooth animations.

### Backend
*   **Node.js & Express.js:** Backend runtime and web framework.
*   **TypeScript:** For type-safe backend development.
*   **Neon Postgres:** Serverless PostgreSQL database.
*   **Drizzle ORM:** TypeScript ORM for relational databases.
*   **Neon Authorize:** For JWT-based authentication and authorization.
*   **Zod:** Schema declaration and validation library.
*   **CORS:** Middleware for Cross-Origin Resource Sharing.
*   **Multer:** Middleware for handling `multipart/form-data` (file uploads).

## Project Structure

This project is organized as a monorepo, containing two main directories:

*   `frontend/`: Contains the React.js application for the user interface.
*   `backend/`: Contains the Node.js Express.js application for the API and database interactions.

## Setup and Running Locally

To get the Tourify application running on your local machine, follow these steps:

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd tourify
```

### 2. Backend Setup

Navigate to the `backend` directory and set up the environment:

```bash
cd backend
pnpm install
```

Create a `.env` file in the `backend/` directory and add your database and authentication URLs:

```
DATABASE_URL="your_neon_postgres_database_url"
JWKS_URL="your_neon_authorize_jwks_url"
# PORT=3000 # Optional: Specify a port if needed
```

Run database migrations to set up the schema:

```bash
pnpm run db:generate
pnpm run db:migrate
```

Start the backend server:

```bash
pnpm run dev
```
The backend will typically run on `http://localhost:3000`.

### 3. Frontend Setup

Open a new terminal, navigate to the `frontend` directory, and install dependencies:

```bash
cd ../frontend
pnpm install
```

Start the frontend development server:

```bash
pnpm dev
```
The frontend application will typically be available at `http://localhost:5173`.

## API Endpoints (High-Level)

*   **`/api/health`**: Check API status.
*   **`/api/tours`**: Authenticated endpoints for CRUD operations on tours.
*   **`/api/tours/:tourId/steps`**: Manage individual steps within a tour.
*   **`/api/tours/:tourId/share`**: Configure tour sharing settings.
*   **`/api/view/:id`**: Public endpoint to view published tours by ID.
*   **`/api/analytics`**: Record analytics events.
*   **`/api/insights`**: Retrieve tour performance insights.
*   **`/api/media`**: Upload images and videos for tours.

Refer to the `backend/README.md` for a more detailed API reference.

## Contributing

Contributions are highly welcome! If you have suggestions for improvements, new features, or bug fixes, please feel free to open an issue or submit a pull request.
