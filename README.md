# Real-time Bookmarking App

A modern, real-time bookmarking application built with **Next.js 14**, **Supabase**, and **Tailwind CSS v4**.

## Features

- ⚡ **Real-time Updates**: Bookmarks appear instantly across all connected devices using Supabase Realtime.
- 🔐 **Authentication**: Secure Google OAuth sign-in via Supabase Auth.
- 🎨 **Modern UI**: Polished interface with responsive design and Tailwind CSS v4 styling.
- 🚀 **Server-Side Rendering**: Optimized performance using Next.js App Router and Server Components.

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
