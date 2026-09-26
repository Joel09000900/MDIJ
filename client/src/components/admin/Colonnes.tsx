import { dateCourte, type Part } from '../../stats'

/**
 * Colonnes des adhésions jour par jour.
 * Une seule mesure → une seule teinte. Seuls le premier, le dernier et le pic
 * portent une étiquette : une valeur sur chaque colonne serait illisible.
 */
export default function Colonnes({ parts, vide }: { parts: Part[]; vide?: string }) {
  const max = Math.max(...parts.map((p) => p.valeur), 1)
  const indexPic = parts.reduce((meilleur, p, i) => (p.valeur > (parts[meilleur]?.valeur ?? 0) ? i : meilleur), 0)
  const total = parts.reduce((s, p) => s + p.valeur, 0)

  if (total === 0) return <p className="graphe-vide">{vide ?? 'Aucune arrivée sur la période.'}</p>

  return (
    <div className="colonnes" role="img" aria-label={`Adhésions des ${parts.length} derniers jours`}>
      {parts.map((p, i) => {
        const etiquette = p.valeur > 0 && (i === indexPic || i === 0 || i === parts.length - 1)
        return (
          <div className="colonne" key={p.cle} title={`${dateCourte(p.cle)} : ${p.valeur}`}>
            {etiquette && <span className="colonne-valeur">{p.valeur}</span>}
            {/* un jour à zéro ne dessine aucune barre : un moignon ferait croire à une valeur */}
            <span className="colonne-barre" style={{ height: p.valeur ? `${Math.max((p.valeur / max) * 100, 6)}%` : '0' }} />
            <span className="colonne-jour">{dateCourte(p.cle)}</span>
          </div>
        )
      })}
    </div>
  )
}
