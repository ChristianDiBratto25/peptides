import Link from 'next/link'
import PublicLayout from '@/components/public/PublicLayout'

export default function NotFound() {
  return (
    <PublicLayout>
      <div className="max-w-4xl mx-auto px-4 py-28 text-center">
        <p className="font-serif text-8xl text-gray-100 mb-6">404</p>
        <h1 className="font-serif text-2xl text-gray-900 mb-3">Page Not Found</h1>
        <p className="text-[15px] text-gray-400 mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link href="/" className="inline-flex px-7 py-3 bg-[#7f21f6] text-white rounded-lg font-medium text-[15px] hover:bg-[#5a0fc0] shadow-[0_2px_12px_rgba(127,33,246,0.3)] transition-all duration-200">
          Back to Home
        </Link>
      </div>
    </PublicLayout>
  )
}
