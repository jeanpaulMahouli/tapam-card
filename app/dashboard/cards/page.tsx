'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Plus,
  QrCode,
  Smartphone,
  X,
  Copy,
  Download,
  Eye,
  EyeOff,
  Trash2,
} from 'lucide-react';

interface Card {
  id: string;
  cardType: string;
  serialNumber: string;
  label: string;
  description: string;
  slug: string;
  isActive: boolean;
  status: string;
  qrCodeUrl: string;
  createdAt: string;
  updatedAt: string;
}

export default function CardsPage() {
  const router = useRouter();
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [qrPreview, setQrPreview] = useState(false);

  const [formData, setFormData] = useState({
    cardType: 'NFC',
    serialNumber: '',
    label: '',
    description: '',
  });

  // Récupérer les cartes
  useEffect(() => {
    async function fetchCards() {
      try {
        const res = await fetch('/api/cards');
        if (!res.ok) {
          if (res.status === 401) {
            router.push('/login?redirect=/dashboard/cards');
            return;
          }
          throw new Error('Failed to fetch cards');
        }
        const data = await res.json();
        setCards(data.cards);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchCards();
  }, [router]);

  // Créer une nouvelle carte
  const handleAddCard = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create card');
      }

      const data = await res.json();
      setCards([data.card, ...cards]);
      setFormData({ cardType: 'NFC', serialNumber: '', label: '', description: '' });
      setShowAddForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  // Activer/désactiver une carte
  const handleToggleActive = async (cardId: string, isActive: boolean) => {
    try {
      const res = await fetch(`/api/cards/${cardId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive }),
      });

      if (!res.ok) throw new Error('Failed to update card');

      const data = await res.json();
      setCards(cards.map((c) => (c.id === cardId ? data.card : c)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  // Supprimer une carte
  const handleDeleteCard = async (cardId: string) => {
    if (!confirm('Are you sure you want to delete this card?')) return;

    try {
      const res = await fetch(`/api/cards/${cardId}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete card');

      setCards(cards.filter((c) => c.id !== cardId));
      setSelectedCard(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  // Copier le profil URL
  const handleCopyUrl = (slug: string) => {
    const url = `${window.location.origin}/${slug}`;
    navigator.clipboard.writeText(url);
  };

  // Télécharger le QR Code
  const handleDownloadQR = (qrCodeUrl: string, label: string) => {
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = `qrcode-${label || 'tapam'}.png`;
    link.click();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading cards...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gold-500 mb-2">My Cards</h1>
          <p className="text-gray-400">
            Manage your NFC cards, QR codes, badges, and other physical supports
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 p-4 bg-red-900 text-red-100 rounded-lg border border-red-700">
            {error}
          </div>
        )}

        {/* Add Card Button */}
        {!showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="mb-8 px-6 py-3 bg-gold-500 text-black font-bold rounded-lg hover:bg-gold-600 transition flex items-center gap-2"
          >
            <Plus size={20} />
            Add New Card
          </button>
        )}

        {/* Add Card Form */}
        {showAddForm && (
          <div className="mb-8 p-6 bg-gray-900 border border-gold-500 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gold-500">Create New Card</h2>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-gray-400 hover:text-gold-500"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleAddCard} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Card Type
                  </label>
                  <select
                    value={formData.cardType}
                    onChange={(e) =>
                      setFormData({ ...formData, cardType: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg focus:outline-none focus:border-gold-500"
                  >
                    <option value="NFC">NFC Card</option>
                    <option value="QR_CODE">QR Code</option>
                    <option value="BADGE">Badge</option>
                    <option value="KEYCHAIN">Keychain</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Serial Number *
                  </label>
                  <input
                    type="text"
                    value={formData.serialNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, serialNumber: e.target.value })
                    }
                    placeholder="e.g., NFC-000001"
                    required
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg focus:outline-none focus:border-gold-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Label
                  </label>
                  <input
                    type="text"
                    value={formData.label}
                    onChange={(e) =>
                      setFormData({ ...formData, label: e.target.value })
                    }
                    placeholder="e.g., My NFC Card"
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg focus:outline-none focus:border-gold-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Optional description"
                    rows={3}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg focus:outline-none focus:border-gold-500"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="px-6 py-2 bg-gold-500 text-black font-bold rounded-lg hover:bg-gold-600 transition"
                >
                  Create Card
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Cards Grid */}
        {cards.length === 0 ? (
          <div className="text-center py-16">
            <QrCode size={48} className="mx-auto text-gray-600 mb-4" />
            <p className="text-gray-400 text-lg">No cards yet</p>
            <p className="text-gray-500 mb-6">
              Create your first NFC card or QR code to get started
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards.map((card) => (
              <div
                key={card.id}
                className="p-6 bg-gray-900 border border-gray-800 rounded-lg hover:border-gold-500 transition cursor-pointer"
                onClick={() => setSelectedCard(card)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    {card.cardType === 'NFC' ? (
                      <Smartphone size={24} className="text-gold-500" />
                    ) : (
                      <QrCode size={24} className="text-gold-500" />
                    )}
                    <div>
                      <h3 className="font-bold text-lg text-white">
                        {card.label || card.cardType}
                      </h3>
                      <p className="text-sm text-gray-500">{card.serialNumber}</p>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      card.status === 'ACTIVE'
                        ? 'bg-green-900 text-green-100'
                        : 'bg-yellow-900 text-yellow-100'
                    }`}
                  >
                    {card.status}
                  </span>
                </div>

                {card.description && (
                  <p className="text-sm text-gray-400 mb-4">{card.description}</p>
                )}

                <div className="flex gap-2 mb-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleActive(card.id, card.isActive);
                    }}
                    className="flex-1 px-3 py-2 bg-gray-800 text-gray-300 rounded hover:bg-gold-500 hover:text-black transition flex items-center justify-center gap-1"
                    title={card.isActive ? 'Deactivate' : 'Activate'}
                  >
                    {card.isActive ? (
                      <Eye size={16} />
                    ) : (
                      <EyeOff size={16} />
                    )}
                    <span className="text-xs">
                      {card.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopyUrl(card.slug);
                    }}
                    className="px-3 py-2 bg-gray-800 text-gray-300 rounded hover:bg-gold-500 hover:text-black transition"
                    title="Copy profile URL"
                  >
                    <Copy size={16} />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownloadQR(card.qrCodeUrl, card.label);
                    }}
                    className="px-3 py-2 bg-gray-800 text-gray-300 rounded hover:bg-gold-500 hover:text-black transition"
                    title="Download QR Code"
                  >
                    <Download size={16} />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteCard(card.id);
                    }}
                    className="px-3 py-2 bg-red-900 text-red-300 rounded hover:bg-red-700 transition"
                    title="Delete card"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <Link
                  href={`/${card.slug}`}
                  target="_blank"
                  className="text-xs text-gold-500 hover:text-gold-400"
                >
                  View Profile →
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* QR Code Modal */}
        {selectedCard && qrPreview && (
          <div
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50"
            onClick={() => setQrPreview(false)}
          >
            <div
              className="bg-gray-900 p-8 rounded-lg max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gold-500">QR Code</h3>
                <button
                  onClick={() => setQrPreview(false)}
                  className="text-gray-400 hover:text-gold-500"
                >
                  <X size={24} />
                </button>
              </div>

              <img
                src={selectedCard.qrCodeUrl}
                alt="QR Code"
                className="w-full bg-white p-4 rounded-lg mb-4"
              />

              <p className="text-sm text-gray-400 text-center mb-4">
                {selectedCard.label || selectedCard.cardType}
              </p>

              <button
                onClick={() =>
                  handleDownloadQR(selectedCard.qrCodeUrl, selectedCard.label)
                }
                className="w-full px-4 py-2 bg-gold-500 text-black font-bold rounded-lg hover:bg-gold-600 transition"
              >
                Download QR Code
              </button>
            </div>
          </div>
        )}

        {/* Card Detail Modal */}
        {selectedCard && !qrPreview && (
          <div
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedCard(null)}
          >
            <div
              className="bg-gray-900 p-8 rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-gold-500 mb-1">
                    {selectedCard.label || selectedCard.cardType}
                  </h3>
                  <p className="text-gray-400">{selectedCard.serialNumber}</p>
                </div>
                <button
                  onClick={() => setSelectedCard(null)}
                  className="text-gray-400 hover:text-gold-500"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-sm text-gray-500">Card Type</p>
                  <p className="text-white font-semibold">{selectedCard.cardType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="text-white font-semibold">{selectedCard.status}</p>
                </div>
                {selectedCard.description && (
                  <div>
                    <p className="text-sm text-gray-500">Description</p>
                    <p className="text-white">{selectedCard.description}</p>
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-4 border-t border-gray-800">
                <button
                  onClick={() => setQrPreview(true)}
                  className="flex-1 px-4 py-2 bg-gold-500 text-black font-bold rounded-lg hover:bg-gold-600 transition"
                >
                  View QR Code
                </button>
                <button
                  onClick={() => setSelectedCard(null)}
                  className="flex-1 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
