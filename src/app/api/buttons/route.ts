import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

// GET - Récupérer les boutons d'un profil
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const profileId = searchParams.get("profileId");

    if (!profileId) {
      return NextResponse.json(
        { error: "profileId is required" },
        { status: 400 }
      );
    }

    const buttons = await prisma.customButton.findMany({
      where: { profileId },
      orderBy: { order: "asc" },
    });

    return NextResponse.json(buttons);
  } catch (error) {
    console.error("Error fetching buttons:", error);
    return NextResponse.json(
      { error: "Failed to fetch buttons" },
      { status: 500 }
    );
  }
}

// POST - Créer un nouveau bouton
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { profileId, label, url } = body;

    if (!profileId || !label || !url) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Vérifier que l'utilisateur possède ce profil
    const profile = await prisma.profile.findUnique({
      where: { id: profileId },
    });

    if (profile?.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Obtenir le prochain ordre
    const lastButton = await prisma.customButton.findFirst({
      where: { profileId },
      orderBy: { order: "desc" },
      select: { order: true },
    });

    const order = (lastButton?.order ?? -1) + 1;

    const button = await prisma.customButton.create({
      data: {
        profileId,
        label,
        url,
        order,
      },
    });

    return NextResponse.json(button);
  } catch (error) {
    console.error("Error creating button:", error);
    return NextResponse.json(
      { error: "Failed to create button" },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour un bouton
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { id, label, url } = body;

    if (!id || !label || !url) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Vérifier que l'utilisateur possède ce bouton
    const button = await prisma.customButton.findUnique({
      where: { id },
      include: { profile: true },
    });

    if (button?.profile.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updatedButton = await prisma.customButton.update({
      where: { id },
      data: { label, url },
    });

    return NextResponse.json(updatedButton);
  } catch (error) {
    console.error("Error updating button:", error);
    return NextResponse.json(
      { error: "Failed to update button" },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un bouton
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    // Vérifier que l'utilisateur possède ce bouton
    const button = await prisma.customButton.findUnique({
      where: { id },
      include: { profile: true },
    });

    if (button?.profile.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.customButton.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting button:", error);
    return NextResponse.json(
      { error: "Failed to delete button" },
      { status: 500 }
    );
  }
}
