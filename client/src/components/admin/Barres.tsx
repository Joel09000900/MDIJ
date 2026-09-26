import type { Part } from '../../stats'

/**
 * Barres horizontales pour comparer des grandeurs.
 * Une seule mesure → une seule teinte (pas de palette catégorielle) ;
 * la valeur est écrite en bout de barre, jamais à l'intérieur.
 */
export default function Barres({ parts, vide }: { parts: Part[]; vide: string }) {
  if (parts.length === 0) return <p className="graphe-vide">{vide}</p>

  const max = Math.max(...parts.map((p) => p.valeur), 1)

  return (
    <ul className="barres">
      {parts.map((p) => (
        <li key={p.cle}>
          <span className="barres-cle" title={p.cle}>
            {p.cle}
          </span>
          <span className="barres-piste">
            <span className="barres-barre" style={{ width: `${Math.max((p.valeur / max) * 100, 2)}%` }} />
          </span>
          <span className="barres-valeur">{p.valeur}</span>
        </li>
      ))}
    </ul>
  )
}
