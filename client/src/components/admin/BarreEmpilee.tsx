import type { CSSProperties } from 'react'
import type { Part } from '../../stats'

/**
 * Part-à-tout sur une seule barre horizontale (jamais un camembert : les angles
 * se comparent mal). Trois teintes validées + un gris pour la queue « Autres ».
 * Légende toujours présente, et étiquette directe dès que le segment est assez large.
 */
const TEINTES = ['var(--serie-1)', 'var(--serie-2)', 'var(--serie-3)']
const GRIS = 'var(--serie-reste)'

export default function BarreEmpilee({ parts }: { parts: Part[] }) {
  const total = parts.reduce((s, p) => s + p.valeur, 0)
  if (total === 0) return <p className="graphe-vide">Aucune donnée à répartir.</p>

  // au-delà de trois catégories, la queue est repliée plutôt que d'inventer des teintes
  const tete = parts.slice(0, 3)
  const queue = parts.slice(3)
  const reste = queue.reduce((s, p) => s + p.valeur, 0)
  const segments = reste > 0 ? [...tete, { cle: 'Autres', valeur: reste }] : tete

  return (
    <div className="empilee-bloc">
      <div className="empilee" role="img" aria-label={`Répartition de ${total} personnes`}>
        {segments.map((p, i) => {
          const pourcent = (p.valeur / total) * 100
          return (
            <span
              key={p.cle}
              className="empilee-part"
              style={{ width: `${pourcent}%`, background: i < 3 ? TEINTES[i] : GRIS } as CSSProperties}
              title={`${p.cle} : ${p.valeur} (${pourcent.toFixed(0)} %)`}
            >
              {/* l'étiquette n'est posée que si elle tient : jamais de texte rogné */}
              {pourcent >= 12 && <span className="empilee-etiquette">{pourcent.toFixed(0)} %</span>}
            </span>
          )
        })}
      </div>

      <ul className="legende">
        {segments.map((p, i) => (
          <li key={p.cle}>
            <span className="legende-pastille" style={{ background: i < 3 ? TEINTES[i] : GRIS } as CSSProperties} />
            {p.cle}
            <strong>{p.valeur}</strong>
          </li>
        ))}
      </ul>
    </div>
  )
}
