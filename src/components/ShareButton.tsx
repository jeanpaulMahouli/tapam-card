'use client';

import React, { useState } from 'react';
import { Share2, Copy, CheckCircle } from 'lucide-react';

interface ShareButtonProps {
  cardSlug: string;
}

export const ShareButton: React.FC<ShareButtonProps> = ({ cardSlug }) => {
  const [copied, setCopied] = useState(false);

  const shareUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/p/${cardSlug}`
      : `http://localhost:3000/p/${cardSlug}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Mon Profil TAPAM Card',
          text: 'Découvrez ma carte de visite digitale',
          url: shareUrl,
        });
      } catch (err) {
        console.error('Share failed:', err);
      }
    } else {
      // Fallback to copy if Web Share API is not supported
      handleCopy();
    }
  };

  return (
    <div className="flex gap-2 flex-col sm:flex-row">
      <button
        onClick={handleShare}
        className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
      >
        <Share2 size={18} />
        Partager
      </button>
      <button
        onClick={handleCopy}
        className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
      >
        {copied ? (
          <>
            <CheckCircle size={18} className="text-green-600" />
            <span>Copié !</span>
          </>
        ) : (
          <>
            <Copy size={18} />
            <span>Copier lien</span>
          </>
        )}
      </button>
    </div>
  );
};
