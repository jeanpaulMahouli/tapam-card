import React from "react";
import {
  FaLinkedin,
  FaFacebook,
  FaInstagram,
  FaTiktok,
  FaXTwitter,
} from "react-icons/fa6";
import {
  MdEmail,
  MdPhone,
} from "react-icons/md";
import { SiWhatsapp } from "react-icons/si";

interface SocialLinksProps {
  linkedin?: string | null;
  facebook?: string | null;
  instagram?: string | null;
  tiktok?: string | null;
  xUrl?: string | null;
  email?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  website?: string | null;
}

export function SocialLinks({
  linkedin,
  facebook,
  instagram,
  tiktok,
  xUrl,
  email,
  phone,
  whatsapp,
  website,
}: SocialLinksProps) {
  const socials = [
    {
      icon: FaLinkedin,
      url: linkedin ? `https://linkedin.com/in/${linkedin}` : null,
      label: "LinkedIn",
      color: "text-blue-600",
    },
    {
      icon: FaFacebook,
      url: facebook ? `https://facebook.com/${facebook}` : null,
      label: "Facebook",
      color: "text-blue-600",
    },
    {
      icon: FaInstagram,
      url: instagram ? `https://instagram.com/${instagram}` : null,
      label: "Instagram",
      color: "text-pink-600",
    },
    {
      icon: FaTiktok,
      url: tiktok ? `https://tiktok.com/@${tiktok}` : null,
      label: "TikTok",
      color: "text-black dark:text-white",
    },
    {
      icon: FaXTwitter,
      url: xUrl,
      label: "X (Twitter)",
      color: "text-black dark:text-white",
    },
    {
      icon: MdEmail,
      url: email ? `mailto:${email}` : null,
      label: "Email",
      color: "text-red-600",
    },
    {
      icon: MdPhone,
      url: phone ? `tel:${phone}` : null,
      label: "Appel",
      color: "text-green-600",
    },
    {
      icon: SiWhatsapp,
      url: whatsapp ? `https://wa.me/${whatsapp.replace(/\D/g, "")}` : null,
      label: "WhatsApp",
      color: "text-green-600",
    },
  ];

  const filteredSocials = socials.filter((social) => social.url);

  if (filteredSocials.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {filteredSocials.map((social) => {
        const Icon = social.icon;
        return (
          <a
            key={social.label}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            title={social.label}
            className={`inline-flex items-center justify-center w-10 h-10 rounded-[10px] bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${social.color}`}
          >
            <Icon size={20} />
          </a>
        );
      })}
    </div>
  );
}
