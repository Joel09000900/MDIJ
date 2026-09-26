/**
 * Jauge de complétude : une part sur un total, avec la piste dans un ton plus
 * clair de la même rampe. Le pourcentage est toujours écrit.
 */
export default function Jauge({
  libelle,
  rempli,
  total,
  precision,
}: {
  libelle: string
  rempli: number
  total: number
  precision?: string
}) {
  const pourcent = total === 0 ? 0 : Math.round((rempli / total) * 100)
  const alerte = pourcent < 80

  return (
    <div className="jauge">
      <div className="jauge-tete">
        <span>{libelle}</span>
        <strong className={alerte ? 'jauge-alerte' : undefined}>{pourcent} %</strong>
      </div>
      <div className="jauge-piste">
        <span className={`jauge-remplie ${alerte ? 'jauge-remplie-alerte' : ''}`} style={{ width: `${pourcent}%` }} />
      </div>
      <small>
        {rempli} sur {total}
        {precision ? ` · ${precision}` : ''}
      </small>
    </div>
  )
}
