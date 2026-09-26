import { useEffect, useState } from 'react'
import { CONTACT, MESSAGE_CONTACT, waLink } from '../content'

const APPS = [
  { id: 'wave', logo: 'WAVE', nom: 'Wave', detail: 'Envoi rapide et sans frais', url: 'https://wave.com', couleur: '#1DC8F2' },
  { id: 'maxit', logo: 'Max it', nom: 'Max It — Orange Money', detail: "Via l'application Orange", url: 'https://www.orange.ci', couleur: '#FF7900' },
] as const

async function copierNumero(): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(CONTACT.numeroDon.replace(/\s/g, ''))
    return true
  } catch {
    return false
  }
}

export default function DonModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [copie, setCopie] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  async function copier() {
    const ok = await copierNumero()
    setCopie(ok)
    if (ok) setTimeout(() => setCopie(false), 2000)
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="don-titre" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="modal-close" aria-label="Fermer" onClick={onClose}>×</button>
        <h3 id="don-titre">Faire un don ou legs 🎁</h3>
        <p>
          Choisis ton appli : elle s'ouvre et le numéro du MDIJ est copié — colle-le et entre le montant. Merci de
          soutenir le combat de la jeunesse !
        </p>

        {APPS.map((a) => (
          <a
            key={a.id}
            className="pay-option"
            href={a.url}
            target="_blank"
            rel="noreferrer"
            onClick={() => void copierNumero()}
          >
            <span className="pay-logo" style={{ background: a.couleur }}>{a.logo}</span>
            <span className="pay-text">
              <strong>{a.nom}</strong>
              <small>{a.detail}</small>
            </span>
            <span className="pay-cta">Payer</span>
          </a>
        ))}

        <div className="don-numero">
          <span>Numéro du MDIJ</span>
          <strong>{CONTACT.numeroDon}</strong>
          <button type="button" className="btn btn-outline-dark" onClick={() => void copier()}>
            {copie ? '✅ Copié' : '📋 Copier le numéro'}
          </button>
        </div>

        <a className="modal-wa" href={waLink(MESSAGE_CONTACT)} target="_blank" rel="noreferrer" aria-label="WhatsApp">💬</a>
      </div>
    </div>
  )
}
