'use client'

import { createClient } from '@/utils/supabase/client'
import { useState } from 'react'
import type { Bookmark } from './BookmarkManager'

type BookmarkFormProps = {
    onAdd: (bookmark: Bookmark) => void
}

export default function BookmarkForm({ onAdd }: BookmarkFormProps) {
    const [title, setTitle] = useState('')
    const [url, setUrl] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        if (!title || !url) {
            setError("Both Title and URL are required.")
            setLoading(false)
            return
        }

        try {
            const supabase = createClient()
            const {
                data: { user },
            } = await supabase.auth.getUser()

            if (!user) {
                setError("You must be logged in to add a bookmark.")
                return
            }

            const { data, error: insertError } = await supabase
                .from('bookmarks')
                .insert([
                    { title, url, user_id: user.id },
                ])
                .select()
                .single()

            if (insertError) {
                throw insertError
            }

            if (data) {
                onAdd(data)
            }

            // Reset form on success
            setTitle('')
            setUrl('')
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="mb-8 p-6 bg-white rounded-lg shadow-md border border-gray-200 dark:bg-gray-800 dark:border-gray-700 w-full">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Add New Bookmark</h3>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                    <span className="block sm:inline">{error}</span>
                </div>
            )}

            <div className="flex flex-col gap-4">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. Supabase Documentation"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                </div>
                <div>
                    <label htmlFor="url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">URL</label>
                    <input
                        type="url"
                        id="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://example.com"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="mt-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors w-full sm:w-auto"
                >
                    {loading ? 'Adding...' : 'Add Bookmark'}
                </button>
            </div>
        </form>
    )
}
