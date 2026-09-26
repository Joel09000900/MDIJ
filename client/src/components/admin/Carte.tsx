/**
 * Carte de chaleur : croise deux dimensions (activité × commune).
 * La rampe séquentielle vient du CSS (« --chaleur-1 » à « --chaleur-6 ») pour
 * que le mode nuit ait ses propres paliers, et non un simple inversement.
 * La valeur est écrite dans chaque case : jamais d'information par la couleur seule.
 */
const PALIERS = 6

function palier(valeur: number, max: number): number {
  if (valeur === 0) return -1
  const p = Math.ceil((valeur / max) * PALIERS) - 1
  return Math.min(Math.max(p, 0), PALIERS - 1)
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
                    className={p < 0 ? 'carte-case carte-case-vide' : `carte-case carte-case-p${p}`}
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
