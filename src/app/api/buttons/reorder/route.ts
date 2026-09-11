import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

// PUT - Réordonner les boutons
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { buttons } = body; // Array of { id, order }

    if (!Array.isArray(buttons)) {
      return NextResponse.json(
        { error: "buttons must be an array" },
        { status: 400 }
      );
    }

    // Vérifier que l'utilisateur possède tous ces boutons
    const buttonIds = buttons.map((b: { id: string }) => b.id);
    const existingButtons = await prisma.customButton.findMany({
      where: { id: { in: buttonIds } },
      include: { profile: true },
    });

    // Vérifier que tous les boutons appartiennent à l'utilisateur
    for (const button of existingButtons) {
      if (button.profile.userId !== session.user.id) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }

    // Mettre à jour l'ordre
    const updatedButtons = await Promise.all(
      buttons.map((b: { id: string; order: number }) =>
        prisma.customButton.update({
          where: { id: b.id },
          data: { order: b.order },
        })
      )
    );

    return NextResponse.json(updatedButtons);
  } catch (error) {
    console.error("Error reordering buttons:", error);
    return NextResponse.json(
      { error: "Failed to reorder buttons" },
      { status: 500 }
    );
  }
}
