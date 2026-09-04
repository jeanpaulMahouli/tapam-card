import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;

    // Valider le slug
    if (!slug || typeof slug !== "string" || slug.length === 0) {
      return NextResponse.json(
        { error: "Invalid slug" },
        { status: 400 }
      );
    }

    // Récupérer le profil avec ses services visibles
    const profile = await db.profile.findUnique({
      where: { slug },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            role: true,
            status: true,
          },
        },
        services: {
          where: { isVisible: true },
          orderBy: { displayOrder: "asc" },
          select: {
            id: true,
            type: true,
            label: true,
            value: true,
            displayOrder: true,
          },
        },
        design: {
          select: {
            id: true,
            backgroundColor: true,
            textColor: true,
            accentColor: true,
            logoUrl: true,
          },
        },
        user: {
          select: {
            cards: {
              where: { status: "ACTIVE" },
              take: 1,
            },
          },
        },
      },
    });

    // Vérifier si le profil existe
    if (!profile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      );
    }

    // Vérifier que l'utilisateur est ACTIVE
    const user = await db.user.findUnique({
      where: { id: profile.userId },
      select: { status: true },
    });

    if (!user || user.status !== "ACTIVE") {
      return NextResponse.json(
        { error: "Profile not available" },
        { status: 403 }
      );
    }

    // Retourner le profil public
    return NextResponse.json({
      success: true,
      data: {
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
        phone: profile.phone,
        jobTitle: profile.jobTitle,
        company: profile.company,
        bio: profile.bio,
        avatarUrl: profile.avatarUrl,
        location: profile.location,
        website: profile.website,
        slug: profile.slug,
        services: profile.services,
        design: profile.design,
      },
    });
  } catch (error) {
    console.error("Error fetching public profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
