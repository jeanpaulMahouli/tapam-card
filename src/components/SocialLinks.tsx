'use client';

import { Instagram, Linkedin, Twitter, Facebook, Youtube, Globe } from 'lucide-react';

type SocialLinksProps = {
  instagram?: string | null;
  linkedin?: string | null;
  twitter?: string | null;
  facebook?: string | null;
  youtube?: string | null;
  website?: string | null;
};

function normalizeUrl(value: string) {
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
}

export default function SocialLinks({
  instagram,
  linkedin,
  twitter,
  facebook,
  youtube,
  website,
}: SocialLinksProps) {
  const links = [
    { value: instagram, label: 'Instagram', Icon: Instagram },
    { value: linkedin, label: 'LinkedIn', Icon: Linkedin },
    { value: twitter, label: 'Twitter', Icon: Twitter },
    { value: facebook, label: 'Facebook', Icon: Facebook },
    { value: youtube, label: 'YouTube', Icon: Youtube },
    { value: website, label: 'Site web', Icon: Globe },
  ].filter((link): link is typeof link & { value: string } => Boolean(link.value?.trim()));

  if (links.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-3" aria-label="Réseaux sociaux">
      {links.map(({ value, label, Icon }) => (
        <a
          key={label}
          href={normalizeUrl(value)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border transition-opacity hover:opacity-70"
        >
          <Icon className="h-5 w-5" aria-hidden="true" />
        </a>
      ))}
    </div>
  );
}
