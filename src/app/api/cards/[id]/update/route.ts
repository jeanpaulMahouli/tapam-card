import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/database';
import { validateCardData, CardFormData } from '@/lib/card-utils';

/**
 * PUT /api/cards/[id]/update
 * Met à jour une carte (authentification requise)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Vérifier l'authentification
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const { id } = params;
    const body = await request.json();

    // Récupérer la carte et vérifier que l'utilisateur en est propriétaire
    const card = await db.getCardById(id);
    if (!card) {
      return NextResponse.json(
        { error: 'Carte non trouvée' },
        { status: 404 }
      );
    }

    if (card.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 403 }
      );
    }

    // Valider les données
    const validation = validateCardData(body);
    if (!validation.valid) {
      return NextResponse.json(
        { error: 'Données invalides', details: validation.errors },
        { status: 400 }
      );
    }

    // Mettre à jour la carte
    const updatedCard = await db.updateCard(id, {
      fullName: body.fullName,
      jobTitle: body.jobTitle,
      company: body.company,
      phone: body.phone,
      email: body.email,
      bio: body.bio,
      location: body.location,
      website: body.website,
      theme: body.theme,
      isConfigured: true,
      updatedAt: new Date(),
    });

    return NextResponse.json(updatedCard);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la carte:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
