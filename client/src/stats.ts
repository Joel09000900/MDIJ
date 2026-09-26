export interface Part {
  cle: string
  valeur: number
}

interface Date_ {
  date: string
}

const JOUR = 24 * 60 * 60 * 1000

function jourISO(d: Date): string {
  return d.toISOString().slice(0, 10)
}

/** Compte les éléments par clé, du plus grand au plus petit. */
export function compter<T>(liste: T[], cle: (x: T) => string, maximum?: number): Part[] {
  const compte = new Map<string, number>()
  for (const x of liste) {
    const k = cle(x).trim() || 'Non renseigné'
    compte.set(k, (compte.get(k) ?? 0) + 1)
  }
  const parts = [...compte.entries()]
    .map(([c, valeur]) => ({ cle: c, valeur }))
    .sort((a, b) => b.valeur - a.valeur || a.cle.localeCompare(b.cle))
  return maximum ? parts.slice(0, maximum) : parts
}

/** Nombre d'éléments enregistrés depuis N jours (N = 1 → dernières 24 heures). */
export function depuis<T extends Date_>(liste: T[], jours: number): number {
  const limite = Date.now() - jours * JOUR
  return liste.filter((x) => new Date(x.date).getTime() >= limite).length
}

/** Une entrée par jour sur les N derniers jours, jours vides compris. */
export function parJour<T extends Date_>(liste: T[], jours: number): Part[] {
  const compte = new Map<string, number>()
  for (const x of liste) {
    const j = x.date.slice(0, 10)
    compte.set(j, (compte.get(j) ?? 0) + 1)
  }
  const suite: Part[] = []
  for (let i = jours - 1; i >= 0; i--) {
    const cle = jourISO(new Date(Date.now() - i * JOUR))
    suite.push({ cle, valeur: compte.get(cle) ?? 0 })
  }
  return suite
}

export function dateCourte(iso: string): string {
  return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })
}

export function dateHeure(iso: string): string {
  return new Date(iso).toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
