import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex flex-col items-center justify-center px-4">
      {/* Logo */}
      <div className="mb-12 text-center">
        <h1 className="text-6xl font-bold tracking-widest mb-2">
          <span className="text-gold-600">TAPAM</span>
        </h1>
        <p className="text-gray-400 text-lg">Digital Professional Identity</p>
      </div>

      {/* Tagline */}
      <div className="max-w-2xl text-center mb-12">
        <p className="text-gray-300 text-xl mb-4">
          Your professional identity, always with you.
        </p>
        <p className="text-gray-500 text-sm">
          Connect your digital profile to physical NFC cards and QR codes.
        </p>
      </div>

      {/* CTA Buttons */}
      <div className="flex gap-4 mb-16">
        <Link
          href="/login"
          className="px-8 py-3 bg-gold-600 text-black font-semibold rounded-lg hover:bg-gold-700 transition-colors"
        >
          Sign In
        </Link>
        <Link
          href="/register"
          className="px-8 py-3 border border-gold-600 text-gold-600 font-semibold rounded-lg hover:bg-gold-600 hover:text-black transition-colors"
        >
          Create Account
        </Link>
      </div>

      {/* Test Profiles */}
      <div className="max-w-2xl w-full bg-gray-800 rounded-lg p-8 border border-gray-700">
        <h2 className="text-gold-600 font-bold mb-4">Demo Profiles</h2>
        
        <div className="space-y-4">
          <div className="bg-gray-900 rounded p-4 border border-gray-700">
            <p className="text-gray-300 mb-2">
              <span className="text-gold-600 font-semibold">Admin Account:</span>
            </p>
            <p className="text-sm text-gray-400">Username: <code className="bg-black px-2 py-1 rounded">admin</code></p>
            <p className="text-sm text-gray-400">Password: <code className="bg-black px-2 py-1 rounded">Admin123!</code></p>
          </div>

          <div className="bg-gray-900 rounded p-4 border border-gray-700">
            <p className="text-gray-300 mb-2">
              <span className="text-gold-600 font-semibold">User Account:</span>
            </p>
            <p className="text-sm text-gray-400">Username: <code className="bg-black px-2 py-1 rounded">TPM-000001</code></p>
            <p className="text-sm text-gray-400">Password: <code className="bg-black px-2 py-1 rounded">Client123!</code></p>
            <Link
              href="/tpm-000001"
              className="text-gold-600 hover:text-gold-400 text-sm mt-3 inline-block"
            >
              → View public profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
