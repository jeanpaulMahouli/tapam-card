'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LogOut, User, QrCode, Settings } from 'lucide-react';

interface User {
  id: string;
  username: string;
  email: string;
  profile?: {
    firstName: string;
    lastName: string;
    slug: string;
  };
}

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch('/api/auth/me');
        if (!res.ok) {
          if (res.status === 401) {
            router.push('/login?redirect=/dashboard');
            return;
          }
          throw new Error('Failed to fetch user');
        }
        const data = await res.json();
        setUser(data.user);
      } catch (err) {
        console.error('Error fetching user:', err);
        router.push('/login?redirect=/dashboard');
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/');
    } catch (err) {
      console.error('Error logging out:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-gold-500">
            TAPAM
          </Link>
          <div className="flex items-center gap-6">
            <span className="text-gray-400">
              Welcome, <span className="text-gold-500 font-semibold">{user.username}</span>
            </span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-900 text-red-100 rounded-lg hover:bg-red-800 transition flex items-center gap-2"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        {/* Welcome Section */}
        <div className="mb-16">
          <h1 className="text-4xl font-bold text-gold-500 mb-2">
            Your Digital Identity
          </h1>
          <p className="text-gray-400 text-lg">
            Manage your professional profile, cards, and personal information
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="p-6 bg-gray-900 border border-gray-800 rounded-lg">
            <div className="text-gold-500 text-3xl font-bold mb-2">
              {user.profile?.firstName} {user.profile?.lastName}
            </div>
            <p className="text-gray-400">@{user.username}</p>
          </div>

          <div className="p-6 bg-gray-900 border border-gray-800 rounded-lg">
            <p className="text-gray-500 text-sm mb-2">Profile Status</p>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-green-400 font-semibold">Active</span>
            </div>
          </div>

          <div className="p-6 bg-gray-900 border border-gray-800 rounded-lg">
            <p className="text-gray-500 text-sm mb-2">Profile URL</p>
            <code className="text-gold-500 text-sm break-all">
              {user.profile?.slug ? `/${user.profile.slug}` : 'Not set'}
            </code>
          </div>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <Link
            href="/dashboard/profile"
            className="p-8 bg-gray-900 border border-gray-800 rounded-lg hover:border-gold-500 transition group"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-gold-500 bg-opacity-10 rounded-lg group-hover:bg-gold-500 group-hover:bg-opacity-20 transition">
                <User size={24} className="text-gold-500" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white group-hover:text-gold-500 transition">
                  Profile
                </h2>
              </div>
            </div>
            <p className="text-gray-400">
              Edit your name, title, company, bio, and personal information
            </p>
            <div className="mt-4 text-gold-500 text-sm font-semibold">
              View & Edit →
            </div>
          </Link>

          {/* Links & Services Card */}
          <Link
            href="/dashboard/profile/links"
            className="p-8 bg-gray-900 border border-gray-800 rounded-lg hover:border-gold-500 transition group"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-gold-500 bg-opacity-10 rounded-lg group-hover:bg-gold-500 group-hover:bg-opacity-20 transition">
                <Settings size={24} className="text-gold-500" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white group-hover:text-gold-500 transition">
                  Links & Services
                </h2>
              </div>
            </div>
            <p className="text-gray-400">
              Add social media links, contact info, and external services
            </p>
            <div className="mt-4 text-gold-500 text-sm font-semibold">
              Manage →
            </div>
          </Link>

          {/* Cards Card */}
          <Link
            href="/dashboard/cards"
            className="p-8 bg-gray-900 border border-gray-800 rounded-lg hover:border-gold-500 transition group"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-gold-500 bg-opacity-10 rounded-lg group-hover:bg-gold-500 group-hover:bg-opacity-20 transition">
                <QrCode size={24} className="text-gold-500" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white group-hover:text-gold-500 transition">
                  Cards & QR Codes
                </h2>
              </div>
            </div>
            <p className="text-gray-400">
              Manage NFC cards, QR codes, badges, and other physical supports
            </p>
            <div className="mt-4 text-gold-500 text-sm font-semibold">
              Manage →
            </div>
          </Link>
        </div>

        {/* Public Profile Section */}
        {user.profile?.slug && (
          <div className="mt-16 p-8 bg-gold-500 bg-opacity-5 border border-gold-500 border-opacity-30 rounded-lg">
            <h3 className="text-xl font-bold text-gold-500 mb-4">Your Public Profile</h3>
            <p className="text-gray-300 mb-4">
              Your professional profile is publicly accessible at:
            </p>
            <div className="flex items-center gap-4">
              <code className="flex-1 px-4 py-3 bg-gray-900 text-gold-500 rounded border border-gray-800 overflow-x-auto">
                {`${typeof window !== 'undefined' ? window.location.origin : ''}/${user.profile.slug}`}
              </code>
              <button
                onClick={() => {
                  const url = `${typeof window !== 'undefined' ? window.location.origin : ''}/${user.profile?.slug}`;
                  navigator.clipboard.writeText(url);
                }}
                className="px-6 py-3 bg-gold-500 text-black font-bold rounded-lg hover:bg-gold-600 transition whitespace-nowrap"
              >
                Copy URL
              </button>
              <Link
                href={`/${user.profile.slug}`}
                target="_blank"
                className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition whitespace-nowrap"
              >
                Preview
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
