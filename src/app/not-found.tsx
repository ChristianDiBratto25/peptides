import Link from 'next/link'
import PublicLayout from '@/components/public/PublicLayout'

export default function NotFound() {
  return (
    <PublicLayout>
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-6xl font-bold text-gray-200 mb-4">404</h1>
        <h2 className="text-2xl font-bold mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link href="/" className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">
          Back to Home
        </Link>
      </div>
    </PublicLayout>
  )
}
