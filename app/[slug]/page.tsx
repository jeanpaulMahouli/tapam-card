import { Metadata } from "next";
import { db } from "@/lib/db";
import Link from "next/link";
import Image from "next/image";
import {
  Mail,
  Phone,
  Briefcase,
  MapPin,
  Globe,
  Linkedin,
  Twitter,
  Github,
  Instagram,
  Facebook,
} from "lucide-react";

const serviceIcons: Record<string, React.ReactNode> = {
  email: <Mail className="w-5 h-5" />,
  phone: <Phone className="w-5 h-5" />,
  website: <Globe className="w-5 h-5" />,
  linkedin: <Linkedin className="w-5 h-5" />,
  twitter: <Twitter className="w-5 h-5" />,
  github: <Github className="w-5 h-5" />,
  instagram: <Instagram className="w-5 h-5" />,
  facebook: <Facebook className="w-5 h-5" />,
};

interface PublicProfilePageProps {
  params: { slug: string };
}

export async function generateMetadata(
  { params }: PublicProfilePageProps
): Promise<Metadata> {
  try {
    const profile = await db.profile.findUnique({
      where: { slug: params.slug },
      include: {
        user: {
          select: { status: true },
        },
      },
    });

    if (!profile || profile.user.status !== "ACTIVE") {
      return {
        title: "Profile not found",
        description: "The profile you're looking for doesn't exist.",
      };
    }

    const title = `${profile.firstName} ${profile.lastName} - TAPAM CARD`;
    const description = profile.bio || `${profile.jobTitle} at ${profile.company}`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: profile.avatarUrl
          ? [
              {
                url: profile.avatarUrl,
                width: 1200,
                height: 630,
                alt: `${profile.firstName} ${profile.lastName}`,
              },
            ]
          : undefined,
        type: "profile",
        url: `${process.env.APP_URL}/${params.slug}`,
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: profile.avatarUrl ? [profile.avatarUrl] : undefined,
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "TAPAM CARD",
      description: "Digital professional identity",
    };
  }
}

export default async function PublicProfilePage({
  params,
}: PublicProfilePageProps) {
  try {
    const profile = await db.profile.findUnique({
      where: { slug: params.slug },
      include: {
        user: {
          select: {
            id: true,
            status: true,
          },
        },
        services: {
          where: { isVisible: true },
          orderBy: { displayOrder: "asc" },
        },
        design: true,
      },
    });

    // Vérifier si le profil existe et que l'utilisateur est actif
    if (!profile || profile.user.status !== "ACTIVE") {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Profile Not Found
            </h1>
            <p className="text-gray-600 mb-6">
              The profile you're looking for doesn't exist or is no longer available.
            </p>
            <Link href="/" className="text-gold-600 hover:text-gold-700 font-semibold">
              ← Back to Home
            </Link>
          </div>
        </div>
      );
    }

    // Récupérer le design personnalisé ou utiliser les defaults
    const bgColor = profile.design?.backgroundColor || "#1a1a1a";
    const textColor = profile.design?.textColor || "#ffffff";
    const accentColor = profile.design?.accentColor || "#d4af37";

    const linkHandlers: Record<string, (value: string) => string> = {
      email: (value) => `mailto:${value}`,
      phone: (value) => `tel:${value}`,
      website: (value) => value.startsWith("http") ? value : `https://${value}`,
      linkedin: (value) => `https://linkedin.com/in/${value}`,
      twitter: (value) => `https://twitter.com/${value}`,
      github: (value) => `https://github.com/${value}`,
      instagram: (value) => `https://instagram.com/${value}`,
      facebook: (value) => `https://facebook.com/${value}`,
    };

    return (
      <div className="min-h-screen" style={{ backgroundColor: bgColor }}>
        {/* Header avec logo */}
        <div className="pt-8 pb-6 text-center border-b border-opacity-10" style={{ borderColor: textColor }}>
          <Link href="/" className="inline-block">
            <div
              className="text-2xl font-bold tracking-wider"
              style={{ color: accentColor }}
            >
              TAPAM
            </div>
          </Link>
        </div>

        {/* Contenu du profil */}
        <div className="max-w-2xl mx-auto px-4 py-12">
          {/* Avatar */}
          {profile.avatarUrl && (
            <div className="flex justify-center mb-8">
              <div
                className="w-40 h-40 rounded-full overflow-hidden border-4"
                style={{ borderColor: accentColor }}
              >
                <Image
                  src={profile.avatarUrl}
                  alt={`${profile.firstName} ${profile.lastName}`}
                  width={160}
                  height={160}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          {/* Nom et titre */}
          <div className="text-center mb-8">
            <h1
              className="text-4xl font-bold mb-2"
              style={{ color: textColor }}
            >
              {profile.firstName} {profile.lastName}
            </h1>
            {profile.jobTitle && (
              <p
                className="text-lg font-semibold mb-2"
                style={{ color: accentColor }}
              >
                {profile.jobTitle}
              </p>
            )}
            {profile.company && (
              <div className="flex items-center justify-center gap-2" style={{ color: textColor }}>
                <Briefcase className="w-4 h-4" />
                <span>{profile.company}</span>
              </div>
            )}
            {profile.location && (
              <div className="flex items-center justify-center gap-2 mt-2" style={{ color: textColor }}>
                <MapPin className="w-4 h-4" />
                <span>{profile.location}</span>
              </div>
            )}
          </div>

          {/* Bio */}
          {profile.bio && (
            <div className="mb-8 text-center" style={{ color: textColor }}>
              <p className="text-sm leading-relaxed opacity-90">{profile.bio}</p>
            </div>
          )}

          {/* Services/Liens */}
          {profile.services.length > 0 && (
            <div className="space-y-3 mb-12">
              {profile.services.map((service) => {
                const href = linkHandlers[service.type]?.(service.value) || "#";
                const icon = serviceIcons[service.type] || <Globe className="w-5 h-5" />;

                return (
                  <a
                    key={service.id}
                    href={href}
                    target={!["email", "phone"].includes(service.type) ? "_blank" : undefined}
                    rel={!["email", "phone"].includes(service.type) ? "noopener noreferrer" : undefined}
                    className="flex items-center gap-4 p-4 rounded-lg transition-all hover:scale-105 hover:shadow-lg"
                    style={{
                      backgroundColor: `${accentColor}15`,
                      border: `1px solid ${accentColor}30`,
                      color: textColor,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = `${accentColor}25`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = `${accentColor}15`;
                    }}
                  >
                    <div style={{ color: accentColor }}>{icon}</div>
                    <div>
                      <p className="text-xs opacity-75 uppercase tracking-wide">{service.label}</p>
                      <p className="font-medium">{service.value}</p>
                    </div>
                  </a>
                );
              })}
            </div>
          )}

          {/* Footer avec mention TAPAM */}
          <div className="text-center text-xs opacity-50" style={{ color: textColor }}>
            <p>Powered by TAPAM CARD</p>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error rendering public profile:", error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Error</h1>
          <p className="text-gray-600">An error occurred while loading the profile.</p>
        </div>
      </div>
    );
  }
}
