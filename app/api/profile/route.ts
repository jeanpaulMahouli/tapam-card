import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import { db } from "@/lib/db";
import { updateProfileSchema } from "@/lib/validators/profile";
import { ZodError } from "zod";

/**
 * GET /api/profile
 * Retourne le profil complet de l'utilisateur connecté
 */
export async function GET(request: NextRequest) {
  try {
    // Vérifier la session
    const session = await verifySession(request.cookies.get("tapam_session")?.value || "");
    if (!session?.userId) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      );
    }

    // Récupérer le profil avec ses services
    const profile = await db.profile.findUnique({
      where: { userId: session.userId },
      include: {
        services: {
          where: { isVisible: true },
          orderBy: { displayOrder: "asc" },
        },
      },
    });

    if (!profile) {
      return NextResponse.json(
        { error: "Profil non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: profile,
    });
  } catch (error) {
    console.error("GET /api/profile error:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/profile
 * Met à jour le profil de l'utilisateur connecté
 */
export async function PATCH(request: NextRequest) {
  try {
    // Vérifier la session
    const session = await verifySession(request.cookies.get("tapam_session")?.value || "");
    if (!session?.userId) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      );
    }

    // Parser et valider le body
    const body = await request.json();
    const validatedData = updateProfileSchema.parse(body);

    // Vérifier que le profil existe
    const existingProfile = await db.profile.findUnique({
      where: { userId: session.userId },
    });

    if (!existingProfile) {
      return NextResponse.json(
        { error: "Profil non trouvé" },
        { status: 404 }
      );
    }

    // Mettre à jour le profil
    const updatedProfile = await db.profile.update({
      where: { userId: session.userId },
      data: {
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        email: validatedData.email,
        phone: validatedData.phone || null,
        jobTitle: validatedData.jobTitle || null,
        company: validatedData.company || null,
        bio: validatedData.bio || null,
        avatarUrl: validatedData.avatarUrl || null,
        location: validatedData.location || null,
        website: validatedData.website || null,
        updatedAt: new Date(),
      },
      include: {
        services: {
          where: { isVisible: true },
          orderBy: { displayOrder: "asc" },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Profil mis à jour avec succès",
      data: updatedProfile,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: "Données invalides",
          details: error.errors,
        },
        { status: 400 }
      );
    }

    console.error("PATCH /api/profile error:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
