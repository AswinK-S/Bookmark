# Real-time Bookmarking App

A modern, real-time bookmarking application built with **Next.js 14**, **Supabase**, and **Tailwind CSS v4**.

## Features

- ⚡ **Real-time Updates**: Bookmarks appear instantly across all connected devices using Supabase Realtime.
- 🔐 **Authentication**: Secure Google OAuth sign-in via Supabase Auth.
- 🎨 **Modern UI**: Polished interface with responsive design and Tailwind CSS v4 styling.
- 🚀 **Server-Side Rendering**: Optimized performance using Next.js App Router and Server Components.

## Project Description

### Overall Approach
The goal was to build a robust, scalable bookmarking application that feels instantaneous to the user. I chose **Next.js 14** for its powerful server-side rendering capabilities and App Router, which simplifies routing and data fetching. By integrating **Supabase**, I leveraged its managed Postgres database and Auth features to reduce backend complexity. The UI is built with **Tailwind CSS**, ensuring a responsive and modern design without writing custom CSS.

### Authentication & User Privacy
Security and privacy are paramount. Authentication is handled via **Supabase Auth** using Google OAuth (PKCE flow), ensuring that user credentials are never stored on our servers.
- **Privacy**: User data is protected using Postgres **Row Level Security (RLS)**. This means the database itself enforces that a user can only `SELECT`, `INSERT`, `UPDATE`, or `DELETE` their own bookmarks. Even if an API endpoint were exposed, it would only return data belonging to the authenticated user.
- **Session Security**: Sessions are managed using secure, HttpOnly cookies, preventing XSS attacks from hijacking user sessions.

### Real-time Implementation
To achieve the "real-time" feel, I adopted a hybrid strategy:
1.  **Optimistic UI Updates**: When a user adds or deletes a bookmark, the specific component (`BookmarkManager`) updates the local state immediately. This gives instant feedback without waiting for a server round-trip.
2.  **Supabase Realtime**: The application subscribes to database changes (`postgres_changes` event) on the `bookmarks` table. If another device (or tab) modifies the data, the application receives a push notification and updates the list automatically. This ensures data consistency across all user sessions.

## Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Backend & Auth**: [Supabase](https://supabase.com/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Supabase project created

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd bookmark
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a `.env.local` file in the root directory and add your Supabase credentials:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

4.  **Run the Development Server:**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) with your browser.

## Database Schema

You will need a `bookmarks` table in Supabase with the following columns:

- `id`: uuid, primary key, default: `gen_random_uuid()`
- `created_at`: timestamptz, default: `now()`
- `title`: text
- `url`: text
- `user_id`: uuid (references `auth.users.id`)

### RLS Policies

Enable Row Level Security (RLS) and add the following policies:

- **Enable read access for authenticated users (own rows only):**
    `auth.uid() = user_id`

- **Enable insert access for authenticated users:**
    `auth.uid() = user_id`

- **Enable delete access for authenticated users (own rows only):**
    `auth.uid() = user_id`
