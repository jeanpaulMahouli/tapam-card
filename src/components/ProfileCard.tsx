'use client';

import React from 'react';
import Image from 'next/image';
import { MapPin, Mail, Phone } from 'lucide-react';

interface ProfileCardProps {
  profile: {
    firstName?: string | null;
    lastName?: string | null;
    title?: string | null;
    subtitle?: string | null;
    bio?: string | null;
    profileImage?: string | null;
    coverImage?: string | null;
    email?: string | null;
    phone?: string | null;
    location?: string | null;
  };
  cardType?: string;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  profile,
  cardType = 'BUSINESS',
}) => {
  const fullName = `${profile.firstName || ''} ${profile.lastName || ''}`.trim();

  return (
    <div className="w-full max-w-md mx-auto overflow-hidden rounded-xl shadow-2xl bg-white">
      {/* Cover Image */}
      <div className="relative h-40 bg-gradient-to-r from-blue-500 to-purple-600 overflow-hidden">
        {profile.coverImage ? (
          <Image
            src={profile.coverImage}
            alt="Cover"
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600" />
        )}
      </div>

      {/* Card Body */}
      <div className="relative px-6 pb-6">
        {/* Profile Image */}
        <div className="flex justify-center -mt-20 mb-4">
          <div className="relative w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-200">
            {profile.profileImage ? (
              <Image
                src={profile.profileImage}
                alt={fullName}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                <span className="text-4xl text-gray-600">👤</span>
              </div>
            )}
          </div>
        </div>

        {/* Name */}
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-1">
          {fullName || 'Utilisateur'}
        </h2>

        {/* Title */}
        {profile.title && (
          <p className="text-lg font-semibold text-center text-blue-600 mb-1">
            {profile.title}
          </p>
        )}

        {/* Subtitle */}
        {profile.subtitle && (
          <p className="text-sm text-center text-gray-600 mb-4">
            {profile.subtitle}
          </p>
        )}

        {/* Bio */}
        {profile.bio && (
          <p className="text-center text-gray-700 text-sm mb-6 leading-relaxed">
            {profile.bio}
          </p>
        )}

        {/* Contact Info */}
        <div className="space-y-2 mb-6 border-t border-gray-200 pt-4">
          {profile.email && (
            <div className="flex items-center gap-3 text-gray-700">
              <Mail size={18} className="text-blue-600 flex-shrink-0" />
              <span className="text-sm truncate">{profile.email}</span>
            </div>
          )}
          {profile.phone && (
            <div className="flex items-center gap-3 text-gray-700">
              <Phone size={18} className="text-blue-600 flex-shrink-0" />
              <span className="text-sm">{profile.phone}</span>
            </div>
          )}
          {profile.location && (
            <div className="flex items-center gap-3 text-gray-700">
              <MapPin size={18} className="text-blue-600 flex-shrink-0" />
              <span className="text-sm">{profile.location}</span>
            </div>
          )}
        </div>

        {/* Card Type Badge */}
        <div className="flex justify-center">
          <span
            className={`px-4 py-1 rounded-full text-xs font-semibold text-white ${
              cardType === 'EXPRESS'
                ? 'bg-green-500'
                : cardType === 'BUSINESS'
                  ? 'bg-blue-500'
                  : 'bg-purple-500'
            }`}
          >
            Carte {cardType}
          </span>
        </div>
      </div>
    </div>
  );
};
