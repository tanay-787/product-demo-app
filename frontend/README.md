# Tourify Frontend

Tourify is a product tour creation and viewing application. This repository contains the frontend part of the application, built with React and Vite.

## Features

*   **Product Tour Editor:** Create interactive product tours with annotations, images, and videos.
*   **Tour Management:** View, edit, publish, and manage your product tours.
*   **Public Tour Viewer:** Share published tours via a unique URL for public viewing.
*   **User Authentication:** Secure access to tour creation and management features.

## Technologies Used

*   **React:** A JavaScript library for building user interfaces.
*   **Vite:** A fast build tool that provides a lean and opinionated development experience for modern web projects.
*   **Shadcn/ui:** A collection of reusable components built using Radix UI and Tailwind CSS.
*   **TypeScript:** A superset of JavaScript that adds static types.
*   **Tailwind CSS:** A utility-first CSS framework for rapidly building custom designs.
*   **React Router DOM:** For client-side routing.
*   **TanStack Query (React Query):** For data fetching, caching, and state management.
*   **Motion/React (Framer Motion):** For animations.

## Setup and Installation

To set up the frontend locally, follow these steps:

1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```

2.  **Install dependencies:**
    ```bash
    pnpm install
    ```
    (If you don't have pnpm, install it using `npm install -g pnpm`)

3.  **Start the development server:**
    ```bash
    pnpm dev
    ```
    The application will typically be available at `http://localhost:5173`.

## Project Structure

*   `src/`: Contains the main application source code.
    *   `assets/`: Static assets like images.
    *   `components/`: Reusable UI components.
    *   `contexts/`: React context providers.
    *   `hooks/`: Custom React hooks.
    *   `lib/`: Utility functions and API configurations.
    *   `pages/`: Top-level components representing different views/pages.
        *   `dashboard/`: Components related to the dashboard.
        *   `editor/`: Components for the tour editor.
        *   `testing/`: Components for testing purposes.
        *   `viewer/`: Components for public tour viewing.
    *   `App.tsx`: Main application component.
    *   `main.tsx`: Entry point of the React application.
    *   `index.css`: Global styles.

## API Integration

The frontend communicates with the backend API. The API base URL is configured in `src/lib/api.ts`. During development, it's set to `/api`, expecting the backend to be served from the same origin or a proxy to handle requests starting with `/api`.

## Contributing

Contributions are welcome! Please feel free to open issues or submit pull requests.