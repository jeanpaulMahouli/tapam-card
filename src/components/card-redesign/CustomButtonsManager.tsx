'use client';

import { useState } from 'react';
import { Trash2, Plus, GripVertical } from 'lucide-react';

interface CustomButton {
  id: string;
  label: string;
  url: string;
  order: number;
}

interface CustomButtonsManagerProps {
  buttons: CustomButton[];
  onSave: (buttons: CustomButton[]) => Promise<void>;
  isLoading?: boolean;
}

export default function CustomButtonsManager({
  buttons: initialButtons,
  onSave,
  isLoading = false,
}: CustomButtonsManagerProps) {
  const [buttons, setButtons] = useState<CustomButton[]>(initialButtons || []);
  const [isSaving, setIsSaving] = useState(false);
  const [newButton, setNewButton] = useState({ label: '', url: '' });

  const handleAddButton = () => {
    if (newButton.label.trim() && newButton.url.trim()) {
      const button: CustomButton = {
        id: `temp-${Date.now()}`,
        label: newButton.label,
        url: newButton.url,
        order: buttons.length,
      };
      setButtons([...buttons, button]);
      setNewButton({ label: '', url: '' });
    }
  };

  const handleRemoveButton = (id: string) => {
    setButtons(buttons.filter((b) => b.id !== id).map((b, i) => ({ ...b, order: i })));
  };

  const handleUpdateButton = (id: string, field: 'label' | 'url', value: string) => {
    setButtons(
      buttons.map((b) =>
        b.id === id ? { ...b, [field]: value } : b
      )
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(buttons);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <h3 className="font-bold text-lg text-gray-800">Boutons d'action personnalisés</h3>

      {/* Add New Button Form */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nom du bouton
          </label>
          <input
            type="text"
            value={newButton.label}
            onChange={(e) => setNewButton({ ...newButton, label: e.target.value })}
            placeholder="ex: Explorer mon site web"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            URL / Lien
          </label>
          <input
            type="url"
            value={newButton.url}
            onChange={(e) => setNewButton({ ...newButton, url: e.target.value })}
            placeholder="https://example.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>
        <button
          onClick={handleAddButton}
          disabled={!newButton.label.trim() || !newButton.url.trim()}
          className="w-full bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-300 text-black font-bold py-2 px-4 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
        >
          <Plus size={16} />
          Ajouter un bouton
        </button>
      </div>

      {/* Existing Buttons List */}
      {buttons.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-gray-700">Boutons existants</h4>
          <div className="space-y-2">
            {buttons.map((button, index) => (
              <div key={button.id} className="bg-white p-3 rounded-lg border border-gray-200 flex gap-3">
                <div className="flex items-center text-gray-400 pt-0.5">
                  <GripVertical size={18} />
                </div>
                <div className="flex-1 space-y-2">
                  <input
                    type="text"
                    value={button.label}
                    onChange={(e) => handleUpdateButton(button.id, 'label', e.target.value)}
                    className="w-full px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    placeholder="Nom du bouton"
                  />
                  <input
                    type="url"
                    value={button.url}
                    onChange={(e) => handleUpdateButton(button.id, 'url', e.target.value)}
                    className="w-full px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    placeholder="URL"
                  />
                </div>
                <button
                  onClick={() => handleRemoveButton(button.id)}
                  className="text-red-500 hover:text-red-700 pt-1 transition-colors"
                  aria-label="Supprimer"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={isSaving || isLoading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded-lg text-sm transition-colors"
      >
        {isSaving || isLoading ? 'Enregistrement...' : 'Enregistrer les modifications'}
      </button>
    </div>
  );
}
