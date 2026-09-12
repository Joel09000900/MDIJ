import { z } from "zod";

export const contactSchema = z.object({
  nom: z.string().trim().min(2, "Le nom est requis").max(100),
  email: z.email("Adresse e-mail invalide").max(200),
  sujet: z.string().trim().min(2, "Le sujet est requis").max(150),
  message: z.string().trim().min(10, "Le message doit contenir au moins 10 caractères").max(5000),
});

export const adhesionSchema = z.object({
  prenom: z.string().trim().min(2, "Le prénom est requis").max(100),
  nom: z.string().trim().min(2, "Le nom est requis").max(100),
  email: z.email("Adresse e-mail invalide").max(200),
  telephone: z.string().trim().min(6, "Numéro de téléphone invalide").max(30),
  ville: z.string().trim().min(2, "La ville est requise").max(100),
  profession: z.string().trim().max(100).optional(),
  motivation: z.string().trim().max(2000).optional(),
  consentement: z.literal(true, "Vous devez accepter les conditions d'adhésion"),
});

/** Transforme les erreurs zod en { champ: premier message d'erreur }. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const details: Record<string, string> = {};
  for (const issue of error.issues) {
    const field = issue.path.join(".");
    if (!(field in details)) details[field] = issue.message;
  }
  return details;
}
