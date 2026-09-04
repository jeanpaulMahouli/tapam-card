import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import { db } from "@/lib/db";
import { createServiceSchema } from "@/lib/validators/profile";
import { ZodError } from "zod";

/**
 * GET /api/profile/services
 * Retourne tous les services du profil de l'utilisateur connecté
 */
export async function GET(request: NextRequest) {
  try {
    const session = await verifySession(request.cookies.get("tapam_session")?.value || "");
    if (!session?.userId) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      );
    }

    // Vérifier que le profil existe
    const profile = await db.profile.findUnique({
      where: { userId: session.userId },
    });

    if (!profile) {
      return NextResponse.json(
        { error: "Profil non trouvé" },
        { status: 404 }
      );
    }

    // Récupérer tous les services
    const services = await db.service.findMany({
      where: { profileId: profile.id },
      orderBy: { displayOrder: "asc" },
    });

    return NextResponse.json({
      success: true,
      data: services,
    });
  } catch (error) {
    console.error("GET /api/profile/services error:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/profile/services
 * Crée un nouveau service pour le profil de l'utilisateur
 */
export async function POST(request: NextRequest) {
  try {
    const session = await verifySession(request.cookies.get("tapam_session")?.value || "");
    if (!session?.userId) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = createServiceSchema.parse(body);

    // Vérifier que le profil existe
    const profile = await db.profile.findUnique({
      where: { userId: session.userId },
    });

    if (!profile) {
      return NextResponse.json(
        { error: "Profil non trouvé" },
        { status: 404 }
      );
    }

    // Créer le service
    const service = await db.service.create({
      data: {
        profileId: profile.id,
        type: validatedData.type,
        label: validatedData.label,
        value: validatedData.value,
        displayOrder: validatedData.displayOrder,
        isVisible: validatedData.isVisible,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Service créé avec succès",
        data: service,
      },
      { status: 201 }
    );
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

    console.error("POST /api/profile/services error:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
