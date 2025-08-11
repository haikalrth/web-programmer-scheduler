import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-4">Welcome to DeskFlo</h1>
      <p className="text-lg mb-8">Your digital workspace for enhanced productivity.</p>
      <div className="flex space-x-4">
        <Link href="/login" className="px-4 py-2 bg-blue-600 text-white rounded-md">
          Login
        </Link>
        <Link href="/request-account" className="px-4 py-2 bg-gray-600 text-white rounded-md">
          Request Account
        </Link>
      </div>
    </div>
  );
}
