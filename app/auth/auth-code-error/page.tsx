'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function ErrorContent() {
    const searchParams = useSearchParams()
    const error = searchParams.get('error')

    return (
        <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
                Authentication Error
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                There was a problem signing you in.
            </p>
            {error && (
                <div className="mt-4 p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-md">
                    <p className="font-semibold">Error Details:</p>
                    <p>{error}</p>
                </div>
            )}
        </div>
    )
}

export default function AuthCodeError() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
            <div className="max-w-md w-full space-y-8">
                <Suspense fallback={<div>Loading error details...</div>}>
                    <ErrorContent />
                </Suspense>

                <div className="mt-5 text-center">
                    <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
                        Return to Login
                    </Link>
                </div>
            </div>
        </div>
    )
}
