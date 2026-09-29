import type { Pilier, Service } from './types'

export const CONTACT = {
  whatsapp: '2250702050284',
  telephone: '+225 07 02 05 02 84',
  numeroDon: '07 02 05 02 84',
  email: 'jp3522885@gmail.com',
  localisation: 'Yopougon, Abidjan',
} as const

/**
 * Navigation principale.
 * Uniquement de vraies pages : plus aucune ancre. La section « Le Mouvement »
 * reste sur l'accueil, atteignable par le bouton du héros. L'accès du président
 * ne figure pas ici : il est dissimulé dans la mention légale du pied de page
 * (voir Footer).
 */
export const NAV = [
  { to: '/', label: 'Accueil' },
  { to: '/nos-combats', label: 'Nos Combats' },
  { to: '/services', label: 'Services' },
  { to: '/le-president', label: 'Le Président' },
  { to: '/realisation', label: 'Réalisations' },
  { to: '/contact', label: 'Contact' },
] as const

export const PILIERS: Pilier[] = [
  {
    icon: '🤝',
    titre: 'Insertion sociale',
    texte: 'Recréer le lien : accompagnement, solidarité et dignité pour chaque jeune trop souvent livré à lui-même.',
  },
  {
    icon: '🎭',
    titre: 'Renaissance culturelle',
    texte: 'Réconcilier la jeunesse avec ses us et coutumes, ses langues et son identité. Moderne sans se renier.',
  },
  {
    icon: '📈',
    titre: 'Puissance économique',
    texte: 'Se lever, entreprendre et conquérir notre souveraineté économique face à la domination étrangère.',
  },
  {
    icon: '🗳️',
    titre: 'Engagement politique',
    texte: 'Ramener la jeunesse au premier plan : des jeunes députés, des jeunes maires, des jeunes qui décident.',
  },
]

export const SERVICES: Service[] = [
  {
    icon: '📄',
    categorie: 'Emploi',
    titre: 'Dépose ton CV',
    texte: 'Envoie-nous ton CV : le MDIJ te trouve des offres d’emploi en ',
    fort: '72 heures',
    apresFort: '. Ta compétence mérite une chance.',
    bouton: '💬 Déposer mon CV',
    message:
      'Bonjour MDIJ, je viens de la rubrique « Déposer mon CV / Offres d\'emploi en 72h ». Je souhaite déposer mon CV.',
  },
  {
    icon: '🚀',
    categorie: 'Entreprendre',
    titre: 'Financement de projet',
    texte: 'Tu as un projet, une idée, une entreprise à lancer ? Le MDIJ t’accompagne pour financer ton ambition.',
    bouton: '💬 Financer mon projet',
    message: 'Bonjour MDIJ, je viens de la rubrique « Financement de projet ». J\'aimerais présenter mon projet.',
  },
  {
    icon: '🎁',
    categorie: 'Solidarité',
    titre: 'Faire un don ou legs',
    texte: 'Soutiens le combat de la jeunesse. Chaque don renforce nos actions sociales, culturelles et économiques.',
    bouton: '🎁 Faire un don / legs',
  },
]

export const AVANTAGES = [
  'Participe aux actions de terrain à Yopougon',
  'Forme-toi et développe ton leadership',
  'Défends la culture et l’économie ivoiriennes',
  'Porte la voix des jeunes jusqu’aux institutions',
] as const

export const MESSAGE_CONTACT = 'Bonjour MDIJ, je vous contacte depuis votre site.'

/**
 * Réseaux proposés sur la page Contact.
 * Seul WhatsApp est actif : remplace les « # » par les vraies adresses
 * Instagram, TikTok et LinkedIn du mouvement.
 */
export const RESEAUX_CONTACT = [
  {
    id: 'whatsapp',
    nom: 'WhatsApp',
    detail: 'Le plus direct : on te répond dans la journée.',
    action: 'Écrire',
    couleur: '#25D366',
    url: `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(MESSAGE_CONTACT)}`,
  },
  {
    id: 'instagram',
    nom: 'Instagram',
    detail: 'Les photos et les coulisses de nos actions de terrain.',
    action: 'Suivre',
    couleur: '#E4405F',
    url: '#',
  },
  {
    id: 'tiktok',
    nom: 'TikTok',
    detail: 'Les vidéos du mouvement et la voix de la jeunesse.',
    action: 'Suivre',
    couleur: '#010101',
    url: '#',
  },
  {
    id: 'linkedin',
    nom: 'LinkedIn',
    detail: 'Emploi, projets et partenariats professionnels.',
    action: 'Suivre',
    couleur: '#0A66C2',
    url: '#',
  },
] as const

export function waLink(message?: string): string {
  const base = `https://wa.me/${CONTACT.whatsapp}`
  return message ? `${base}?text=${encodeURIComponent(message)}` : base
}
