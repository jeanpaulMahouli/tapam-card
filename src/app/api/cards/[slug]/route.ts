import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';
import { formatCardDisplay } from '@/lib/card-utils';

/**
 * GET /api/cards/[slug]
 * Récupère une carte publique par son slug
 * Incrémente également le compteur de vues
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    if (!slug) {
      return NextResponse.json(
        { error: 'Slug manquant' },
        { status: 400 }
      );
    }

    // Récupérer la carte
    const card = await db.getCardBySlug(slug);

    if (!card) {
      return NextResponse.json(
        { error: 'Carte non trouvée' },
        { status: 404 }
      );
    }

    // Vérifier que la carte est configurée
    if (!card.isConfigured) {
      return NextResponse.json(
        { error: 'Cette carte n\'est pas encore configurée' },
        { status: 403 }
      );
    }

    // Incrémenter le compteur de vues
    await db.incrementViewCount(card.id);

    // Formater et retourner
    const formattedCard = formatCardDisplay(card);

    return NextResponse.json(formattedCard, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de la carte:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
