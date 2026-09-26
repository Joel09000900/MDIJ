/**
 * Les domiciles du registre sont saisis à la main : « Yop-Sud », « Yopougon Sud »,
 * « Cite Verte », « Yop-Cité Verte » désignent les mêmes lieux. Ce module ramène
 * chaque saisie à un couple (quartier, commune) stable, sans quoi les comptages
 * seraient éclatés en doublons.
 */

/** Minuscules, sans accents, tirets et ponctuation remplacés par des espaces. */
function aplatir(texte: string): string {
  return texte
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

/** Libellés lisibles pour les quartiers dont l'orthographe varie. */
const LIBELLES: Record<string, string> = {
  sud: 'Yopougon Sud',
  'cite verte': 'Cité Verte',
  'n dotre': "N'Dotre",
  ndotre: "N'Dotre",
  kouweit: 'Kouweit',
  azito: 'Azito',
  millionnaire: 'Millionnaire',
  lokoa: 'Lokoa',
  texaco: 'Texaco',
  sodeci: 'Sodeci',
  sideci: 'Sideci',
  cie: 'CIE',
  tenlo: 'Tenlo',
  calate: 'Calate',
  sifcom: 'Sifcom',
  palmeraie: 'Palmeraie',
}

function joliMot(mot: string): string {
  return mot.charAt(0).toUpperCase() + mot.slice(1)
}

export interface Lieu {
  quartier: string
  commune: string
}

export function normaliserLieu(brut: string | null | undefined): Lieu {
  const plat = aplatir(brut ?? '')
  if (!plat) return { quartier: 'Non renseigné', commune: 'Non renseignée' }

  // le préfixe de commune est retiré : « yop sud » et « yopougon sud » se rejoignent
  const sansPrefixe = plat.replace(/^(yopougon|yop)\s+/, '').trim()

  let commune = 'Yopougon'
  let reste = sansPrefixe
  if (/\babobo\b/.test(plat)) {
    commune = 'Abobo'
    reste = plat.replace(/\babobo\b/, '').trim()
  } else if (/\badjame\b/.test(plat)) {
    commune = 'Adjamé'
    reste = plat.replace(/\badjame\b/, '').trim()
  } else if (/\b(cocody|palmeraie)\b/.test(plat)) {
    commune = 'Cocody'
    reste = plat.replace(/\bcocody\b/, '').trim()
  }

  // « N'Dotre » seul est un quartier d'Abobo, même sans le mot « Abobo »
  if (commune === 'Yopougon' && /^(n dotre|ndotre)$/.test(reste)) commune = 'Abobo'

  if (!reste) return { quartier: commune, commune }

  const quartier = LIBELLES[reste] ?? reste.split(' ').map(joliMot).join(' ')
  return { quartier, commune }
}

/** « 07-71-41-96-50 » → « 07 71 41 96 50 ». Renvoie null si le numéro est absent. */
export function normaliserTelephone(brut: string | null | undefined): string | null {
  const chiffres = (brut ?? '').replace(/\D/g, '')
  if (chiffres.length < 8) return null
  const local = chiffres.startsWith('225') ? chiffres.slice(3) : chiffres
  return local.replace(/(\d{2})(?=\d)/g, '$1 ').trim()
}

/** Le type énuméré de la base n'est pas accentué : on l'affiche correctement. */
const ACTIVITES: Record<string, string> = {
  Eleve: 'Élève',
  Etudiant: 'Étudiant',
  Entrepreneur: 'Entrepreneur',
  Autre: 'Autre',
}

export function libelleActivite(brut: string | null | undefined): string {
  if (!brut) return 'Non renseignée'
  return ACTIVITES[brut] ?? brut
}
