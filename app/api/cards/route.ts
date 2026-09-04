import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAuth } from "@/lib/auth";
import { db } from "@/lib/db";
import { createCardSchema } from "@/lib/validators/card";
import { generateQRCode } from "@/lib/qrcode";

// GET /api/cards - Récupère toutes les cartes de l'utilisateur connecté
export async function GET(request: NextRequest) {
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

    const cards = await db.card.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
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

    return NextResponse.json({ cards });
  } catch (error) {
    console.error("[Cards GET]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/cards - Crée une nouvelle carte
export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const validatedData = createCardSchema.parse(body);

    // Vérifier que le numéro de série n'existe pas déjà
    const existingCard = await db.card.findUnique({
      where: { serialNumber: validatedData.serialNumber },
    });

    if (existingCard) {
      return NextResponse.json(
        { error: "Card with this serial number already exists" },
        { status: 409 }
      );
    }

    // Récupérer le profil de l'utilisateur pour le slug
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { profile: { select: { slug: true } } },
    });

    if (!user?.profile?.slug) {
      return NextResponse.json(
        { error: "User profile not found" },
        { status: 404 }
      );
    }

    // Générer le QR Code
    const qrCodeUrl = (await generateQRCode(user.profile.slug)) as string;

    // Créer la carte
    const card = await db.card.create({
      data: {
        userId,
        cardType: validatedData.cardType,
        serialNumber: validatedData.serialNumber,
        label: validatedData.label,
        description: validatedData.description,
        slug: `${validatedData.cardType.toLowerCase()}-${Date.now()}`,
        qrCodeUrl,
        isActive: false,
        status: "INACTIVE",
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

    return NextResponse.json({ card }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message.includes("validation")) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("[Cards POST]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
