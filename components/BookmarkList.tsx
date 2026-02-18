'use client'

import type { Bookmark } from './BookmarkManager'

type BookmarkListProps = {
    bookmarks: Bookmark[]
    loading: boolean
    onDelete: (id: string) => void
}

export default function BookmarkList({ bookmarks, loading, onDelete }: BookmarkListProps) {
    if (loading) {
        return <div className="text-center py-10">Loading bookmarks...</div>
    }

    if (bookmarks.length === 0) {
        return <div className="text-center py-10 text-gray-500">No bookmarks yet. Add one above!</div>
    }

    return (
        <div className="grid grid-cols-1 gap-4 w-full">
            {bookmarks.map((bookmark) => (
                <div
                    key={bookmark.id}
                    className="p-4 bg-white rounded-lg shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700 flex justify-between items-center group transition-all hover:shadow-md"
                >
                    <div className="overflow-hidden">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                            {bookmark.title || 'Untitled'}
                        </h4>
                        <a
                            href={bookmark.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 truncate block transition-colors"
                        >
                            {bookmark.url}
                        </a>
                    </div>
                    <button
                        onClick={() => onDelete(bookmark.id)}
                        className="ml-4 flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-md transition-colors focus:outline-none dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
                        aria-label="Delete bookmark"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        Delete
                    </button>
                </div>
            ))}
        </div>
    )
}
