**Round is a self-hostable, open-source alternative to Linear, designed for efficient issue tracking and project management.**

Built with modern web technologies, Round aims to provide a fast, clean, and intuitive interface for development teams.

## Table of Contents

- [Table of Contents](#table-of-contents)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
  - [Database Setup](#database-setup)
  - [Running the App](#running-the-app)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Project Management:** Organize work within distinct projects.
- **Issue Tracking:** Create, view, and manage issues with details like:
  - Title & Description
  - Status (Backlog, Todo, In Progress, Review, Done, Canceled)
  - Priority (Low, Medium, High)
  - Assignee (from project members)
  - Target Date
  - Labels (Multiple labels per issue)
- **Dashboard:** View a list of projects you are a member of.
- **Project View:** Dedicated page for each project listing its issues, grouped by status.
- **Real-time Updates (Partial):** Update issue status, priority, and assignee directly from the list view (more properties planned).
- **Authentication:** Secure login using GitHub OAuth (via `better-auth`).
- **Theme Switching:** Light and Dark mode support.
- **Modern UI:** Clean interface built with Tailwind CSS and Radix UI primitives.
- **Self-Hostable:** Full control over your data and deployment.

## Tech Stack

- **Framework:** Next.js 15 (App Router, Turbopack)
- **Language:** TypeScript
- **Authentication:** `better-auth` (with GitHub Provider)
- **Database:** PostgreSQL
- **ORM:** Drizzle ORM
- **Styling:** Tailwind CSS v4, `tw-animate-css`
- **UI Components:** `shadcn/ui` (Built on Radix UI & Tailwind), `lucide-react` (Icons), `sonner` (Toasts)

## Getting Started

Follow these steps to get a local instance of Round running.

### Prerequisites

- Node.js (v20 or later recommended)
- npm, yarn, or pnpm
- Access to a PostgreSQL database instance.
- A GitHub account (for OAuth setup).

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/r4ultv/round.git
    cd round
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

### Configuration

1.  **Create an environment file:**
    Duplicate the `.env.example` file (if you have one) or create a new file named `.env.local` in the root of the project.

2.  **Set environment variables:**
    Add the following variables to your `.env.local` file:

    ```env
    # Database Connection URL
    # Example: postgresql://user:password@host:port/database
    POSTGRES_URL="your_postgresql_connection_string"

    # GitHub OAuth Credentials
    # Create a GitHub OAuth App: https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app
    # Set Authorization callback URL to: http://localhost:3000/api/auth/callback/github (or your deployed URL)
    GITHUB_CLIENT_ID="your_github_client_id"
    GITHUB_CLIENT_SECRET="your_github_client_secret"

    # Application URL (used for auth callbacks and client-side redirects)
    # Use http://localhost:3000 for local development
    NEXT_PUBLIC_APP_URL="http://localhost:3000"

    # Optional: Add a secret for session encryption (recommended for production)
    # BETTER_AUTH_SECRET="generate_a_strong_random_string"
    ```

    - Replace placeholder values with your actual credentials.
    - Ensure the `NEXT_PUBLIC_APP_URL` matches where your app is running, including the correct callback path in your GitHub OAuth App settings.

### Database Setup

1.  **Install Drizzle Kit (if not already installed globally or locally):**

    ```bash
    npm install -D drizzle-kit
    # or
    yarn add -D drizzle-kit
    # or
    pnpm add -D drizzle-kit
    ```

2.  **Generate Migrations (Optional but Recommended):**
    While the schema is provided, it's good practice to generate migrations.

    ```bash
    npx drizzle-kit generate
    ```

3.  **Apply Migrations:**
    Ensure your PostgreSQL database specified in `POSTGRES_URL` is running and accessible. Then, apply the schema migrations:
    ```bash
    npx drizzle-kit migrate
    ```
    _Alternatively, if you prefer pushing schema changes directly during development (potentially destructive), you can use `npx drizzle-kit push`._

### Running the App

1.  **Start the development server:**

    ```bash
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    ```

2.  **Open the application:**
    Navigate to `http://localhost:3000` (or the URL specified in `NEXT_PUBLIC_APP_URL`) in your browser.

## Contributing

Contributions are welcome! If you'd like to contribute, please follow these steps:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/your-feature-name`).
3.  Make your changes.
4.  Commit your changes (`git commit -m 'Add some feature'`).
5.  Push to the branch (`git push origin feature/your-feature-name`).
6.  Open a Pull Request.

Please ensure your code adheres to the existing style and includes tests where applicable.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details (or add an MIT license file).
