import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-2xl mx-auto text-center px-4">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Tech Nation Application Tool
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Intelligently organize and format your evidence documents for your Tech Nation Global Talent Visa application
        </p>
        <div className="space-y-4">
          <Link
            href="/dashboard/stage1"
            className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition-colors"
          >
            Get Started
          </Link>
          <p className="text-sm text-gray-500 mt-4">
            Help us match your Tech Nation criteria and create a strong application
          </p>
        </div>
      </div>
    </div>
  );
}
