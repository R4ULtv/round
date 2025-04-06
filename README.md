![Round og image](./public/og-image.png)

**Round is a self-hostable, open-source alternative to Linear, designed for efficient issue tracking and project management.**

Built with modern web technologies, Round aims to provide a fast, clean, and intuitive interface for development teams.

## Table of Contents

- [Round](#round)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Screenshots](#screenshots)
  - [Tech Stack](#tech-stack)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Configuration](#configuration)
    - [Database Setup](#database-setup)
    - [Running the App](#running-the-app)
  - [Architecture](#architecture)
  - [Deployment](#deployment)
    - [Deploying to Vercel](#deploying-to-vercel)
    - [Deploying with Docker](#deploying-with-docker)
  - [Development](#development)
    - [Project Structure](#project-structure)
    - [Adding New Features](#adding-new-features)
  - [Troubleshooting](#troubleshooting)
  - [Contributing](#contributing)
  - [Roadmap](#roadmap)
  - [License](#license)

## Features

- **Project Management:** Organize work within distinct projects with dedicated views
- **Issue Tracking:** Create, view, and manage issues with comprehensive details:
  - Title & Description
  - Status (Backlog, Todo, In Progress, Review, Done, Canceled)
  - Priority (No Priority, Low, Medium, High)
  - Assignee (from project members)
  - Target Date (with calendar selection)
  - Labels (Multiple labels per issue with color coding)
- **Dashboard:** View a list of projects you are a member of with quick access
- **Project View:** Dedicated page for each project listing its issues, grouped by status
- **Authentication:** Secure login using GitHub OAuth (via `better-auth`)
- **Team Collaboration:**
  - Invite team members to collaborate on projects
  - Assign issues to specific team members
- **Responsive Design:** Works on desktop and mobile devices
- **Theme Switching:** Light and Dark mode support with beautifully designed UI
- **Keyboard Shortcuts:** Improve productivity with keyboard shortcuts
  - `Ctrl/Cmd + B` - Toggle sidebar
  - `C` - Create new issue
  - `Ctrl/Cmd + P` - Create new project
- **Self-Hostable:** Full control over your data and deployment

## Tech Stack

- **Framework:** Next.js 15 (App Router, Turbopack)
- **Language:** TypeScript
- **Authentication:** `better-auth` (with GitHub Provider)
- **Database:** PostgreSQL
- **ORM:** Drizzle ORM
- **Styling:**
  - Tailwind CSS v4
  - `tw-animate-css` for animations
  - OKLCH color format for modern color support
- **UI Components:**
  - `shadcn/ui` (Built on Radix UI primitives)
  - `lucide-react` for iconography
  - `sonner` for toast notifications
  - Custom components built for the application
- **State Management:** React's built-in hooks with context providers

## Getting Started

Follow these steps to get a local instance of Round running on your machine.

### Prerequisites

- Node.js (v20 or later recommended)
- npm, yarn, or pnpm
- PostgreSQL database (v14 or later)
- GitHub account for OAuth setup

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/r4ultv/round.git
   cd round
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

### Configuration

1. **Create an environment file:**
   Create a new file named `.env.local` in the root of the project.

2. **Set environment variables:**
   Add the following variables to your `.env.local` file:

   ```env
   # Database Connection URL
   # Example: postgresql://user:password@host:port/database
   POSTGRES_URL="your_postgresql_connection_string"

   # GitHub OAuth Credentials
   # Create a GitHub OAuth App at https://github.com/settings/developers
   # Set Authorization callback URL to http://localhost:3000/api/auth/callback/github (for local development)
   GITHUB_CLIENT_ID="your_github_client_id"
   GITHUB_CLIENT_SECRET="your_github_client_secret"

   # Application URL (used for auth callbacks and client-side redirects)
   NEXT_PUBLIC_APP_URL="http://localhost:3000" # Change in production

   # Secret for session encryption (required for production)
   # Generate with: `node -e "console.log(crypto.randomBytes(32).toString('hex'))"`
   BETTER_AUTH_SECRET="generate_a_strong_random_string"
   ```

3. **GitHub OAuth Setup:**
   - Go to GitHub Settings > Developer Settings > OAuth Apps > New OAuth App
   - Set Application name to "Round" (or your preferred name)
   - Homepage URL: `http://localhost:3000` (for local development)
   - Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
   - After registration, generate a client secret and copy both Client ID and Client Secret to your `.env.local` file

### Database Setup

1. **Install Drizzle Kit:**
   ```bash
   npm install -D drizzle-kit
   # or
   yarn add -D drizzle-kit
   # or
   pnpm add -D drizzle-kit
   ```

2. **Generate Migrations:**
   This step creates the SQL migration files from your schema:
   ```bash
   npx drizzle-kit generate
   ```

3. **Apply Migrations:**
   Ensure your PostgreSQL database specified in `POSTGRES_URL` is running and accessible. Then, apply the schema migrations:
   ```bash
   npx drizzle-kit migrate
   ```

   For development purposes, you can also directly push schema changes (caution: potentially destructive):
   ```bash
   npx drizzle-kit push
   ```

### Running the App

1. **Start the development server:**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

2. **Access the application:**
   Navigate to `http://localhost:3000` in your browser.

3. **First Login:**
   - Click on "Login with GitHub"
   - Authorize the application
   - You'll be redirected to the dashboard where you can create your first project

## Architecture

Round is built using a modern web architecture:

- **Frontend and Backend:** Next.js 15 with App Router for both client and server components
- **Authentication:** Handled by `better-auth` with GitHub OAuth provider
- **Database Access:** Server components connect directly to PostgreSQL using Drizzle ORM
- **State Management:** Uses React context and server components for data fetching
- **API Layer:** Next.js API routes handle server-side operations

The application follows these key principles:
- Server Components for data-heavy operations
- Client Components for interactive elements
- Progressive enhancement for better user experience
- Responsive design using Tailwind CSS

## Troubleshooting

**Authentication Issues:**
- Ensure your GitHub OAuth credentials are correctly configured
- Check that the callback URL matches your deployed URL

**Database Connection:**
- Verify PostgreSQL is running and accessible
- Check that your connection string in `.env.local` is valid

**UI Issues:**
- Clear your browser cache if you see unusual styling
- Check browser console for errors

**For more help:**
- Create an issue on GitHub with detailed information about the problem
- Include steps to reproduce, expected behavior, and actual behavior

## Contributing

Contributions are welcome! If you'd like to contribute, please follow these steps:

1. **Fork the repository**
2. **Create a new branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes and commit them:**
   ```bash
   git commit -m 'Add some feature'
   ```
4. **Push to the branch:**
   ```bash
   git push origin feature/your-feature-name
   ```
5. **Open a Pull Request**

Please ensure your code adheres to the following guidelines:
- Use TypeScript for all new code
- Follow the existing code style and organization
- Include comments for complex logic
- Add tests for new features where appropriate
- Update documentation to reflect changes

## Roadmap

Future plans for Round include:

- **Context-Menu for Issues:** Efficient issue management with right-click action menus
- **Sub-Issues:** Support for nested issues and hierarchical task organization
- **Markdown Support:** Rich text formatting for issue descriptions and comments
- **Enhanced Dashboard:** Comprehensive view with all projects, statistics, and insights
- **Advanced Filtering:** Add more filtering options for issues

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
