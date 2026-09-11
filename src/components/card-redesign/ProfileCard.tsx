'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { SunIcon, MoonIcon } from 'lucide-react';
import SocialLinks from '../SocialLinks';

interface CustomButton {
  id: string;
  label: string;
  url: string;
  order: number;
}

interface Profile {
  id: string;
  firstName: string;
  lastName: string;
  title?: string;
  subtitle?: string;
  profileImage?: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
  tiktok?: string;
  snapchat?: string;
  whatsapp?: string;
  youtube?: string;
  customButtons: CustomButton[];
  theme?: string;
}

interface ProfileCardProps {
  profile: Profile;
  onShare?: () => void;
  onSave?: () => void;
}

export default function ProfileCard({ profile, onShare, onSave }: ProfileCardProps) {
  const [isDarkMode, setIsDarkMode] = useState(profile.theme === 'dark');

  const fullName = `${profile.firstName} ${profile.lastName}`;
  const sortedButtons = [...(profile.customButtons || [])].sort((a, b) => a.order - b.order);

  const bgClass = isDarkMode ? 'bg-slate-900' : 'bg-white';
  const textClass = isDarkMode ? 'text-white' : 'text-black';
  const secondaryTextClass = isDarkMode ? 'text-gray-400' : 'text-gray-600';
  const borderClass = isDarkMode ? 'border-gray-700' : 'border-gray-200';

  return (
    <div className={`min-h-screen ${bgClass} ${textClass} flex items-center justify-center p-4 transition-colors duration-300`}>
      <div className={`w-full max-w-md ${isDarkMode ? 'bg-slate-800' : 'bg-white'} rounded-3xl shadow-2xl overflow-hidden transition-colors duration-300`}>
        
        {/* Header with Logo & Theme Toggle */}
        <div className={`${isDarkMode ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' : 'bg-gradient-to-br from-slate-100 via-white to-slate-50'} p-6 relative`}>
          <div className="flex justify-between items-center mb-8">
            <div className="text-center flex-1">
              <h1 className={`text-2xl font-bold tracking-wider ${isDarkMode ? 'text-blue-300' : 'text-slate-800'}`}>
                TAPAM
              </h1>
              <p className={`text-xs tracking-widest ${isDarkMode ? 'text-blue-200/60' : 'text-slate-600'}`}>CARD</p>
            </div>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-3 rounded-full ${isDarkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-white hover:bg-gray-100'} shadow-md transition-all`}
              aria-label="Toggle theme"
            >
              {isDarkMode ? (
                <SunIcon size={20} className="text-yellow-400" />
              ) : (
                <MoonIcon size={20} className="text-slate-600" />
              )}
            </button>
          </div>

          {/* Profile Image Section */}
          <div className="flex gap-4 items-start">
            {/* Photo with golden border */}
            <div className="relative flex-shrink-0">
              <div className="w-28 h-28 rounded-3xl border-4 border-yellow-400 overflow-hidden bg-gradient-to-br from-yellow-300 to-yellow-500 p-1">
                {profile.profileImage ? (
                  <Image
                    src={profile.profileImage}
                    alt={fullName}
                    width={112}
                    height={112}
                    className="w-full h-full object-cover rounded-3xl"
                    priority
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center text-white font-bold text-3xl rounded-3xl">
                    {fullName.charAt(0)}
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 pt-2">
              <button
                onClick={onSave}
                className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-4 rounded-xl text-sm transition-colors shadow-md hover:shadow-lg active:scale-95"
              >
                + Enregistrer
              </button>
              <button
                onClick={onShare}
                className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-4 rounded-xl text-sm transition-colors shadow-md hover:shadow-lg active:scale-95"
              >
                ⤴
              </button>
            </div>
          </div>
        </div>

        {/* Profile Info Section */}
        <div className={`${isDarkMode ? 'bg-slate-800' : 'bg-white'} px-6 py-8`}>
          {/* Name */}
          <h2 className={`text-2xl font-bold ${textClass} tracking-wide`}>
            {fullName}
          </h2>

          {/* Title & Subtitle */}
          {profile.title && (
            <p className={`${secondaryTextClass} font-semibold text-sm mt-1`}>
              {profile.title}
            </p>
          )}
          {profile.subtitle && (
            <p className={`${secondaryTextClass} text-xs mt-0.5`}>
              {profile.subtitle}
            </p>
          )}

          {/* TAPAM Card Label */}
          <p className={`font-bold text-xs tracking-widest mt-3 ${isDarkMode ? 'text-blue-300' : 'text-slate-600'}`}>
            TAPAM Card
          </p>

          {/* Contact Info */}
          <div className={`mt-4 space-y-2 border-t ${borderClass} pt-4`}>
            {profile.phone && (
              <a
                href={`tel:${profile.phone}`}
                className={`block text-sm font-semibold ${secondaryTextClass} hover:${isDarkMode ? 'text-blue-300' : 'text-blue-600'} transition-colors`}
              >
                {profile.phone}
              </a>
            )}
            {profile.email && (
              <a
                href={`mailto:${profile.email}`}
                className={`block text-sm font-semibold ${secondaryTextClass} hover:${isDarkMode ? 'text-blue-300' : 'text-blue-600'} break-all transition-colors`}
              >
                {profile.email}
              </a>
            )}
          </div>

          {/* Social Links */}
          <div className="mt-6">
            <SocialLinks profile={profile} size="md" />
          </div>

          {/* Custom Action Buttons */}
          {sortedButtons.length > 0 && (
            <div className="mt-6 space-y-3">
              {sortedButtons.map((button) => (
                <a
                  key={button.id}
                  href={button.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-4 px-6 rounded-2xl text-center text-sm transition-colors shadow-md hover:shadow-lg active:scale-95"
                >
                  {button.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
