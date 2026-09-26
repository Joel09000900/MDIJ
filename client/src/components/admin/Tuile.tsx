/** Tuile de statistique : un libellé, une valeur, et une précision facultative. */
export default function Tuile({
  libelle,
  valeur,
  precision,
  principale = false,
}: {
  libelle: string
  valeur: number | string
  precision?: string
  principale?: boolean
}) {
  return (
    <article className={`tuile ${principale ? 'tuile-principale' : ''}`}>
      <span className="tuile-libelle">{libelle}</span>
      <strong className="tuile-valeur">{typeof valeur === 'number' ? valeur.toLocaleString('fr-FR') : valeur}</strong>
      {precision && <small className="tuile-precision">{precision}</small>}
    </article>
  )
}
