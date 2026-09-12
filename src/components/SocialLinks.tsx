'use client';

import React from 'react';
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Github,
  Mail,
  Phone,
  MessageCircle,
  Globe,
} from 'lucide-react';

interface SocialLink {
  platform: string;
  url: string;
  label?: string;
}

interface SocialLinksProps {
  links?: SocialLink[];
  email?: string;
  phone?: string;
  whatsapp?: string;
  website?: string;
}

export const SocialLinks: React.FC<SocialLinksProps> = ({
  links = [],
  email,
  phone,
  whatsapp,
  website,
}) => {
  const getIcon = (platform: string) => {
    const lowerPlatform = platform.toLowerCase();

    const iconProps = {
      size: 24,
      className: 'text-white',
    };

    switch (lowerPlatform) {
      case 'facebook':
        return <Facebook {...iconProps} />;
      case 'twitter':
      case 'x':
        return <Twitter {...iconProps} />;
      case 'instagram':
        return <Instagram {...iconProps} />;
      case 'linkedin':
        return <Linkedin {...iconProps} />;
      case 'github':
        return <Github {...iconProps} />;
      case 'website':
      case 'site':
        return <Globe {...iconProps} />;
      case 'email':
        return <Mail {...iconProps} />;
      case 'phone':
        return <Phone {...iconProps} />;
      case 'whatsapp':
      case 'whats app':
        return <MessageCircle {...iconProps} />;
      default:
        return <Globe {...iconProps} />;
    }
  };

  const getBackgroundColor = (platform: string) => {
    const lowerPlatform = platform.toLowerCase();

    const colors: { [key: string]: string } = {
      facebook: 'bg-blue-600 hover:bg-blue-700',
      twitter: 'bg-sky-500 hover:bg-sky-600',
      x: 'bg-black hover:bg-gray-800',
      instagram: 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600',
      linkedin: 'bg-blue-700 hover:bg-blue-800',
      github: 'bg-gray-800 hover:bg-gray-900',
      website: 'bg-indigo-600 hover:bg-indigo-700',
      site: 'bg-indigo-600 hover:bg-indigo-700',
      email: 'bg-red-500 hover:bg-red-600',
      phone: 'bg-green-600 hover:bg-green-700',
      whatsapp: 'bg-green-500 hover:bg-green-600',
      'whats app': 'bg-green-500 hover:bg-green-600',
    };

    return colors[lowerPlatform] || 'bg-gray-600 hover:bg-gray-700';
  };

  const getUrl = (platform: string, providedUrl?: string) => {
    if (providedUrl) return providedUrl;

    const lowerPlatform = platform.toLowerCase();

    switch (lowerPlatform) {
      case 'email':
        return email ? `mailto:${email}` : '#';
      case 'phone':
        return phone ? `tel:${phone}` : '#';
      case 'whatsapp':
      case 'whats app':
        return whatsapp ? `https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}` : '#';
      case 'website':
      case 'site':
        return website || '#';
      default:
        return '#';
    }
  };

  // Combine all social links
    const allLinks: Array<SocialLink & { url: string }> = [
      ...links.map((link) => ({
        ...link,
        url: getUrl(link.platform, link.url),
      })),
    ];

    // Add direct contact methods if not already in links
    if (email && !allLinks.some((l) => l.platform.toLowerCase() === 'email')) {
      allLinks.push({ platform: 'email', url: `mailto:${email}`, label: 'Email' });
    }
    if (phone && !allLinks.some((l) => l.platform.toLowerCase() === 'phone')) {
      allLinks.push({ platform: 'phone', url: `tel:${phone}`, label: 'Appel' });
    }
    if (whatsapp && !allLinks.some((l) => l.platform.toLowerCase().includes('whatsapp'))) {
      allLinks.push({
        platform: 'whatsapp',
        url: getUrl('whatsapp', whatsapp),
        label: 'WhatsApp',
      });
    }

    if (allLinks.length === 0) {
      return null;
    }

    return (
      <div className="flex flex-wrap gap-3 justify-center">
        {allLinks.map((link, index) => (
          <a
            key={index}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`p-3 rounded-full transition-transform transform hover:scale-110 ${getBackgroundColor(
              link.platform,
            )}`}
            title={link.label || link.platform}
            aria-label={link.label || link.platform}
          >
            {getIcon(link.platform)}
          </a>
        ))}
      </div>
    );
  };
