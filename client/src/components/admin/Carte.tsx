import type { CSSProperties } from 'react'

/**
 * Carte de chaleur : croise deux dimensions (activité × commune).
 * Rampe séquentielle d'une seule teinte, du clair au foncé — la valeur se lit
 * aussi en clair dans chaque case, donc jamais par la couleur seule.
 */
const RAMPE = ['#f0e6f7', '#d9c2ea', '#b98fd6', '#8b45b0', '#6b2a90', '#4e1a6b']

function palier(valeur: number, max: number): number {
  if (valeur === 0) return -1
  const p = Math.ceil((valeur / max) * RAMPE.length) - 1
  return Math.min(Math.max(p, 0), RAMPE.length - 1)
}

export default function Carte({
  lignes,
  colonnes,
  valeur,
}: {
  lignes: string[]
  colonnes: string[]
  valeur: (ligne: string, colonne: string) => number
}) {
  const max = Math.max(...lignes.flatMap((l) => colonnes.map((c) => valeur(l, c))), 1)

  return (
    <div className="carte-enveloppe">
      <table className="carte">
        <thead>
          <tr>
            <th />
            {colonnes.map((c) => (
              <th key={c} scope="col">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {lignes.map((l) => (
            <tr key={l}>
              <th scope="row">{l}</th>
              {colonnes.map((c) => {
                const v = valeur(l, c)
                const p = palier(v, max)
                return (
                  <td
                    key={c}
                    className={`carte-case ${p >= 3 ? 'carte-case-foncee' : ''}`}
                    style={{ background: p < 0 ? 'transparent' : RAMPE[p] } as CSSProperties}
                    title={`${l} · ${c} : ${v}`}
                  >
                    {v > 0 ? v : '—'}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
