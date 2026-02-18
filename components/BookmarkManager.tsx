'use client'

import { createClient } from '@/utils/supabase/client'
import { useEffect, useState } from 'react'
import BookmarkForm from './BookmarkForm'
import BookmarkList from './BookmarkList'
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js'

export type Bookmark = {
    id: string
    title: string
    url: string
    created_at: string
    user_id: string
}

export default function BookmarkManager() {
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
                    if (payload.eventType === 'INSERT') {
                        setBookmarks((prev) => [payload.new as Bookmark, ...prev])
                    } else if (payload.eventType === 'DELETE') {
                        setBookmarks((prev) => prev.filter((bookmark) => bookmark.id !== payload.old.id))
                    }
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [])

    const handleAdd = (newBookmark: Bookmark) => {
        // Optimistic update or just ensure we don't have duplicates if realtime also fires
        setBookmarks((prev) => {
            if (prev.some(b => b.id === newBookmark.id)) return prev
            return [newBookmark, ...prev]
        })
    }

    const handleDelete = async (id: string) => {
        // Optimistic update
        setBookmarks((prev) => prev.filter(b => b.id !== id))

        const { error } = await supabase.from('bookmarks').delete().eq('id', id)
        if (error) {
            console.error("Error deleting bookmark:", error)
            // Revert if error (optional, for now just log)
            alert("Failed to delete bookmark")
        }
    }

    return (
        <div className="flex flex-col gap-6">
            <BookmarkForm onAdd={handleAdd} />
            <div className="w-full">
                <BookmarkList bookmarks={bookmarks} loading={loading} onDelete={handleDelete} />
            </div>
        </div>
    )
}
