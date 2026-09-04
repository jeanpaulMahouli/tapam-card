import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import { db } from "@/lib/db";
import { updateServiceSchema } from "@/lib/validators/profile";
import { ZodError } from "zod";

/**
 * PATCH /api/profile/services/[id]
 * Met à jour un service spécifique
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await verifySession(request.cookies.get("tapam_session")?.value || "");
    if (!session?.userId) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = updateServiceSchema.parse({ ...body, id: params.id });

    // Vérifier que le service appartient au profil de l'utilisateur
    const service = await db.service.findUnique({
      where: { id: params.id },
      include: { profile: true },
    });

    if (!service) {
      return NextResponse.json(
        { error: "Service non trouvé" },
        { status: 404 }
      );
    }

    if (service.profile.userId !== session.userId) {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 403 }
      );
    }

    // Mettre à jour le service
    const updatedService = await db.service.update({
      where: { id: params.id },
      data: {
        ...(validatedData.type && { type: validatedData.type }),
        ...(validatedData.label && { label: validatedData.label }),
        ...(validatedData.value && { value: validatedData.value }),
        ...(validatedData.displayOrder !== undefined && { displayOrder: validatedData.displayOrder }),
        ...(validatedData.isVisible !== undefined && { isVisible: validatedData.isVisible }),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Service mis à jour avec succès",
      data: updatedService,
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

    console.error("PATCH /api/profile/services/[id] error:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/profile/services/[id]
 * Supprime un service spécifique
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await verifySession(request.cookies.get("tapam_session")?.value || "");
    if (!session?.userId) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      );
    }

    // Vérifier que le service appartient au profil de l'utilisateur
    const service = await db.service.findUnique({
      where: { id: params.id },
      include: { profile: true },
    });

    if (!service) {
      return NextResponse.json(
        { error: "Service non trouvé" },
        { status: 404 }
      );
    }

    if (service.profile.userId !== session.userId) {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 403 }
      );
    }

    // Supprimer le service
    await db.service.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      success: true,
      message: "Service supprimé avec succès",
    });
  } catch (error) {
    console.error("DELETE /api/profile/services/[id] error:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
