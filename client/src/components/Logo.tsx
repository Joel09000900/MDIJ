/** Proportions réelles du fichier logo.png (568 × 439). */
const RATIO = 568 / 439

export default function Logo({ taille = 46 }: { taille?: number }) {
  return (
    <img
      src="/images/logo.png"
      alt="Logo MDIJ"
      height={taille}
      width={Math.round(taille * RATIO)}
      className="logo-img"
    />
  )
}
