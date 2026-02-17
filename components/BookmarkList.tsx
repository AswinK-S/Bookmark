'use client'

import { createClient } from '@/utils/supabase/client'
import { useEffect, useState } from 'react'
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js'

type Bookmark = {
    id: string
    title: string
    url: string
    created_at: string
    user_id: string
}

export default function BookmarkList() {
    const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
    const [loading, setLoading] = useState(true)

    const supabase = createClient()

    useEffect(() => {
        const fetchBookmarks = async () => {
            const { data, error } = await supabase
                .from('bookmarks')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) {
                console.error('Error fetching bookmarks:', error)
            } else {
                setBookmarks(data || [])
            }
            setLoading(false)
        }

        fetchBookmarks()

        // Real-time subscription
        const channel = supabase
            .channel('realtime bookmarks')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'bookmarks',
                },
                (payload: RealtimePostgresChangesPayload<Bookmark>) => {
                    console.log('Realtime change:', payload)
                    if (payload.eventType === 'INSERT') {
                        setBookmarks((prev) => [payload.new as Bookmark, ...prev])
                    } else if (payload.eventType === 'DELETE') {
                        setBookmarks((prev) => prev.filter((bookmark) => bookmark.id !== payload.old.id))
                    }
                    // NOTE: Update logic can be added here if we implement editing
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, []) // Empty dependency array ensures this runs once on mount

    const handleDelete = async (id: string) => {
        const { error } = await supabase.from('bookmarks').delete().eq('id', id)
        if (error) {
            console.error("Error deleting bookmark:", error)
            alert("Failed to delete bookmark")
        }
    }

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
                        onClick={() => handleDelete(bookmark.id)}
                        className="ml-4 p-2 text-gray-400 hover:text-red-500 transition-colors focus:outline-none"
                        aria-label="Delete bookmark"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
            ))}
        </div>
    )
}
