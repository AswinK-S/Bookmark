import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import BookmarkForm from '@/components/BookmarkForm'
import BookmarkList from '@/components/BookmarkList'

export default async function Home() {
    const supabase = createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return redirect('/login')
    }

    return (
        <div className="flex items-center justify-center min-h-screen p-4 sm:p-8 bg-gray-50 dark:bg-gray-900 font-[family-name:var(--font-geist-sans)] transition-colors">
            <main className="flex flex-col gap-6 w-full max-w-2xl">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 w-full bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
                    <div>
                        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                            My Bookmarks
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {user.email}
                        </p>
                    </div>

                    <form action="/auth/signout" method="post">
                        <button
                            className="px-5 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-900/20 dark:hover:bg-red-900/30 dark:text-red-400 rounded-lg font-medium transition-all duration-200 border border-transparent hover:border-red-200 dark:hover:border-red-800"
                            type="submit"
                        >
                            Sign Out
                        </button>
                    </form>
                </div>

                {/* Main Content Area */}
                <div className="flex flex-col gap-6">
                    <BookmarkForm />

                    <div className="w-full">
                        <BookmarkList />
                    </div>
                </div>
            </main>
        </div>
    );
}
