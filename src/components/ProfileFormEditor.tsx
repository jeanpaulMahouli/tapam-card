'use client';

import React, { useState } from 'react';
import { CardFormData, validateCardData } from '@/lib/card-utils';

interface ProfileFormEditorProps {
  initialData?: CardFormData;
  onSubmit: (data: CardFormData) => Promise<void>;
  isLoading?: boolean;
  cardId: string;
}

/**
 * Formulaire unifié pour éditer le profil d'une carte
 */
export function ProfileFormEditor({
  initialData,
  onSubmit,
  isLoading = false,
  cardId,
}: ProfileFormEditorProps) {
  const [formData, setFormData] = useState<CardFormData>(
    initialData || {
      fullName: '',
      jobTitle: '',
      company: '',
      phone: '',
      email: '',
      bio: '',
      location: '',
      website: '',
      theme: 'Silver',
    }
  );

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Effacer l'erreur pour ce champ
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');

    // Valider les données
    const validation = validateCardData(formData);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    try {
      await onSubmit(formData);
      setSuccessMessage('Profil mis à jour avec succès! ✨');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrors({
        submit: error instanceof Error ? error.message : 'Une erreur est survenue',
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Messages de succès/erreur */}
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            {successMessage}
          </div>
        )}

        {errors.submit && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {errors.submit}
          </div>
        )}

        {/* Nom complet */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nom complet *
          </label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${
              errors.fullName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Jean Paul Mahouli"
            disabled={isLoading}
          />
          {errors.fullName && (
            <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
          )}
        </div>

        {/* Titre professionnel */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Titre professionnel *
          </label>
          <input
            type="text"
            name="jobTitle"
            value={formData.jobTitle}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${
              errors.jobTitle ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Développeur Full Stack"
            disabled={isLoading}
          />
          {errors.jobTitle && (
            <p className="text-red-500 text-sm mt-1">{errors.jobTitle}</p>
          )}
        </div>

        {/* Société */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Société *
          </label>
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${
              errors.company ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Ma Société"
            disabled={isLoading}
          />
          {errors.company && (
            <p className="text-red-500 text-sm mt-1">{errors.company}</p>
          )}
        </div>

        {/* Téléphone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Téléphone
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${
              errors.phone ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="+33 6 12 34 56 78"
            disabled={isLoading}
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="contact@example.com"
            disabled={isLoading}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bio
          </label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
            placeholder="Une petite présentation..."
            disabled={isLoading}
          />
        </div>

        {/* Localisation */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Localisation
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Paris, France"
            disabled={isLoading}
          />
        </div>

        {/* Site web */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Site web
          </label>
          <input
            type="url"
            name="website"
            value={formData.website}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${
              errors.website ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="https://example.com"
            disabled={isLoading}
          />
          {errors.website && (
            <p className="text-red-500 text-sm mt-1">{errors.website}</p>
          )}
        </div>

        {/* Thème */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Thème
          </label>
          <select
            name="theme"
            value={formData.theme}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            disabled={isLoading}
          >
            <option value="Silver">Argent</option>
            <option value="Gold">Or</option>
            <option value="Black">Noir</option>
          </select>
        </div>

        {/* Boutons */}
        <div className="flex gap-4 pt-6">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-3 px-4 rounded-lg transition-colors"
          >
            {isLoading ? '⏳ Enregistrement...' : '✅ Enregistrer'}
          </button>
        </div>
      </form>
    </div>
  );
}
