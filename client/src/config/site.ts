// Informations générales du site — à personnaliser en un seul endroit.
export const site = {
  sigle: "MDIJ",
  nomComplet: "Mouvement MDIJ",
  slogan: "Ensemble, construisons l'avenir.",
  president: {
    nom: "Nom du Président",
    titre: "Président du MDIJ",
  },
  contact: {
    email: "contact@mdij.example",
    telephone: "+000 00 00 00 00",
    adresse: "Adresse du siège du mouvement",
  },
};

/** Initiales d'un nom, en ignorant les mots en minuscules (« du », « de »…). */
export function initiales(nom: string): string {
  return nom
    .split(/\s+/)
    .filter((mot) => mot && mot[0] === mot[0].toUpperCase())
    .map((mot) => mot[0])
    .join("")
    .slice(0, 2);
}

export const navLinks = [
  { to: "/", label: "Accueil" },
  { to: "/a-propos", label: "À propos" },
  { to: "/le-president", label: "Le Président" },
  { to: "/contact", label: "Contact" },
];
