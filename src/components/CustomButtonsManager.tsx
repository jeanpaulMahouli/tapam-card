"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus, GripVertical } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface CustomButton {
  id: string;
  label: string;
  url: string;
  order: number;
}

interface CustomButtonsManagerProps {
  profileId: string;
}

export function CustomButtonsManager({
  profileId,
}: CustomButtonsManagerProps) {
  const [buttons, setButtons] = useState<CustomButton[]>([]);
  const [loading, setLoading] = useState(true);
  const [newLabel, setNewLabel] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Charger les boutons existants
  useEffect(() => {
    fetchButtons();
  }, [profileId]);

  const fetchButtons = async () => {
    try {
      const response = await fetch(
        `/api/buttons?profileId=${profileId}`
      );
      if (response.ok) {
        const data = await response.json();
        setButtons(data);
      }
    } catch (error) {
      console.error("Error fetching buttons:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddButton = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabel.trim() || !newUrl.trim()) return;

    try {
      const response = await fetch("/api/buttons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profileId,
          label: newLabel,
          url: newUrl,
        }),
      });

      if (response.ok) {
        setNewLabel("");
        setNewUrl("");
        await fetchButtons();
      }
    } catch (error) {
      console.error("Error adding button:", error);
    }
  };

  const handleDeleteButton = async (id: string) => {
    try {
      const response = await fetch(`/api/buttons?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchButtons();
      }
    } catch (error) {
      console.error("Error deleting button:", error);
    } finally {
      setDeleteId(null);
    }
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Formulaire d'ajout */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-semibold mb-4">Ajouter un bouton</h3>
        <form onSubmit={handleAddButton} className="space-y-3">
          <Input
            type="text"
            placeholder="Nom du bouton (ex: Explorer mon site web)"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            required
          />
          <Input
            type="url"
            placeholder="URL (ex: https://example.com)"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            required
          />
          <Button
            type="submit"
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
          >
            <Plus className="w-4 h-4 mr-2" />
            Ajouter le bouton
          </Button>
        </form>
      </div>

      {/* Liste des boutons */}
      {buttons.length > 0 ? (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Vos boutons</h3>
          {buttons.map((button) => (
            <div
              key={button.id}
              className="flex items-center gap-3 bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-700"
            >
              <GripVertical className="w-5 h-5 text-slate-400" />
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{button.label}</p>
                <p className="text-sm text-slate-500 truncate">{button.url}</p>
              </div>
              <button
                onClick={() => setDeleteId(button.id)}
                className="p-2 hover:bg-red-50 dark:hover:bg-red-950 rounded-md transition"
              >
                <Trash2 className="w-5 h-5 text-red-500" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-slate-500 text-center py-8">
          Aucun bouton ajouté pour le moment
        </p>
      )}

      {/* Dialog de confirmation de suppression */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogTitle>Supprimer le bouton</AlertDialogTitle>
          <AlertDialogDescription>
            Êtes-vous sûr de vouloir supprimer ce bouton ? Cette action est
            irréversible.
          </AlertDialogDescription>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteId) {
                  handleDeleteButton(deleteId);
                }
              }}
              className="bg-red-500 hover:bg-red-600"
            >
              Supprimer
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
