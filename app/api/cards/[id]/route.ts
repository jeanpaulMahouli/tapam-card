import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAuth } from "@/lib/auth";
import { db } from "@/lib/db";
import { updateCardSchema } from "@/lib/validators/card";

// PATCH /api/cards/[id] - Met à jour une carte
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("tapam_session")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId, valid } = await verifyAuth(token);

    if (!valid || !userId) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    const { id } = params;

    // Vérifier que la carte appartient à l'utilisateur
    const card = await db.card.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!card || card.userId !== userId) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 });
    }

    const body = await request.json();
    const validatedData = updateCardSchema.parse(body);

    // Mettre à jour la carte
    const updatedCard = await db.card.update({
      where: { id },
      data: {
        ...(validatedData.label !== undefined && { label: validatedData.label }),
        ...(validatedData.description !== undefined && {
          description: validatedData.description,
        }),
        ...(validatedData.isActive !== undefined && {
          isActive: validatedData.isActive,
        }),
        ...(validatedData.status !== undefined && {
          status: validatedData.status,
        }),
      },
      select: {
        id: true,
        cardType: true,
        serialNumber: true,
        label: true,
        description: true,
        slug: true,
        isActive: true,
        status: true,
        qrCodeUrl: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ card: updatedCard });
  } catch (error) {
    if (error instanceof Error && error.message.includes("validation")) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("[Cards PATCH]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/cards/[id] - Supprime une carte
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("tapam_session")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId, valid } = await verifyAuth(token);

    if (!valid || !userId) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    const { id } = params;

    // Vérifier que la carte appartient à l'utilisateur
    const card = await db.card.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!card || card.userId !== userId) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 });
    }

    // Supprimer la carte
    await db.card.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Card deleted successfully" });
  } catch (error) {
    console.error("[Cards DELETE]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
