import { useEffect, useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { MONTANTS_WAVE, waveLien } from '../content'

/** « 2000 » -> « 2 000 » (espace insécable). Intl.NumberFormat('fr-FR') ne groupe pas les nombres à 4 chiffres. */
const formatMontant = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '\u00a0')

/**
 * Codes QR des liens Wave, générés dans le navigateur : rien n'est stocké ni envoyé
 * à un service tiers, et le QR encode exactement le lien du bouton voisin.
 * La bibliothèque est chargée à la demande, elle ne sert qu'ici.
 */
function useCodesQr(montants: readonly number[]): Record<number, string> {
  const [codes, setCodes] = useState<Record<number, string>>({})

  useEffect(() => {
    let annule = false
    void import('qrcode').then(async ({ default: QRCode }) => {
      const paires = await Promise.all(
        montants.map(async (m) => [m, await QRCode.toDataURL(waveLien(m), { width: 320, margin: 1, errorCorrectionLevel: 'M' })] as const),
      )
      if (!annule) setCodes(Object.fromEntries(paires))
    })
    return () => {
      annule = true
    }
  }, [montants])

  return codes
}

/** Page « Don par Wave » : un code QR et un bouton par montant. */
export default function DonWave() {
  const codes = useCodesQr(MONTANTS_WAVE)

  return (
    <section id="don-wave" className="section">
      <div className="container">
        <div className="section-head" data-reveal>
          <span className="wave-logo" aria-label="Wave">WAVE</span>
          <span className="section-tag">Faire un don</span>
          <h2 className="section-title">Donne avec Wave</h2>
          <p className="section-sub">
            Choisis le montant que tu veux investir dans le combat de la jeunesse, puis scanne le code avec l'appli
            Wave. Sur téléphone, touche simplement le bouton : le montant est déjà rempli.
          </p>
        </div>

        <div className="wave-grille">
          {MONTANTS_WAVE.map((montant, i) => {
            const affiche = `${formatMontant(montant)} FCFA`
            return (
              <article
                key={montant}
                className="card wave-carte"
                data-reveal
                style={{ '--delai': `${(i % 4) * 0.08}s` } as CSSProperties}
              >
                <strong className="wave-montant">{affiche}</strong>
                <div className="wave-qr">
                  {codes[montant] ? (
                    <img src={codes[montant]} alt={`Code QR pour donner ${affiche} avec Wave`} width={160} height={160} />
                  ) : (
                    <span className="wave-qr-attente" aria-hidden="true" />
                  )}
                </div>
                <a className="btn btn-primary btn-block" href={waveLien(montant)} target="_blank" rel="noreferrer">
                  Payer {affiche}
                </a>
              </article>
            )
          })}
        </div>

        <p className="wave-note" data-reveal>
          Le paiement s'affiche au nom de <strong>Konan Famien</strong> dans l'appli Wave. Merci de soutenir le MDIJ !
        </p>
        <p className="wave-retour">
          <Link to="/services">← Retour aux services</Link>
        </p>
      </div>
    </section>
  )
}
