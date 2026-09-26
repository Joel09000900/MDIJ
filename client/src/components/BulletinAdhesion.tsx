import { useState, type CSSProperties, type ChangeEvent, type FormEvent } from 'react'
import { envoyerAdhesion } from '../api'
import { AVANTAGES, waLink } from '../content'
import { SOUHAITS, type AdhesionErrors, type AdhesionForm } from '../types'

const VIDE: AdhesionForm = { nom: '', telephone: '', quartier: '', souhait: '' }

function valider(f: AdhesionForm): AdhesionErrors {
  const e: AdhesionErrors = {}
  if (f.nom.trim().length < 3) e.nom = 'Indique ton nom et tes prénoms.'
  const chiffres = f.telephone.replace(/\D/g, '')
  if (chiffres.length < 8 || chiffres.length > 15) e.telephone = 'Numéro invalide.'
  if (f.quartier.trim().length < 2) e.quartier = 'Indique ton quartier ou ta commune.'
  if (!f.souhait) e.souhait = 'Fais un choix.'
  return e
}

function messageSecours(f: AdhesionForm): string {
  return [
    'Bonjour MDIJ, je souhaite adhérer au mouvement.',
    '',
    `Nom & prénoms : ${f.nom}`,
    `Téléphone / WhatsApp : ${f.telephone}`,
    `Quartier / Commune : ${f.quartier}`,
    `Je souhaite : ${f.souhait}`,
  ].join('\n')
}

type Etat = 'idle' | 'envoi' | 'ok' | 'erreur'

export default function BulletinAdhesion() {
  const [form, setForm] = useState<AdhesionForm>(VIDE)
  const [erreurs, setErreurs] = useState<AdhesionErrors>({})
  const [etat, setEtat] = useState<Etat>('idle')

  function onChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
    setErreurs((er) => ({ ...er, [name]: undefined }))
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const er = valider(form)
    setErreurs(er)
    if (Object.keys(er).length > 0) return

    setEtat('envoi')
    let lien = waLink(messageSecours(form))
    try {
      const res = await envoyerAdhesion(form)
      if (!res.ok) {
        setErreurs(res.errors ?? {})
        setEtat('erreur')
        return
      }
      if (res.whatsappUrl) lien = res.whatsappUrl
    } catch {
      // API injoignable : on passe quand même par WhatsApp pour ne perdre aucune adhésion.
    }
    window.open(lien, '_blank', 'noopener')
    setEtat('ok')
    setForm(VIDE)
  }

  return (
    <section id="rejoindre" className="section section-alt">
      <div className="container rejoindre-grid">
        <div data-reveal>
          <span className="section-tag">Passe à l'action</span>
          <h2 className="section-title">Rejoins le MDIJ. Écris l'histoire.</h2>
          <p>
            Le changement ne se regarde pas, il se construit. En rejoignant le MDIJ, tu deviens acteur d'un mouvement
            qui rend à la jeunesse sa force et sa fierté.
          </p>
          <ul className="avantages">
            {AVANTAGES.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        </div>

        <form className="card form" data-reveal style={{ '--delai': '0.12s' } as CSSProperties} onSubmit={onSubmit} noValidate>
          <h3>Bulletin d'adhésion</h3>
          <p className="form-hint">Remplis ce formulaire, un responsable te recontacte.</p>

          <label htmlFor="nom">Nom &amp; prénoms</label>
          <input id="nom" name="nom" value={form.nom} onChange={onChange} autoComplete="name" />
          {erreurs.nom && <small className="err">{erreurs.nom}</small>}

          <label htmlFor="telephone">Téléphone / WhatsApp</label>
          <input id="telephone" name="telephone" type="tel" value={form.telephone} onChange={onChange} autoComplete="tel" />
          {erreurs.telephone && <small className="err">{erreurs.telephone}</small>}

          <label htmlFor="quartier">Quartier / Commune</label>
          <input id="quartier" name="quartier" value={form.quartier} onChange={onChange} />
          {erreurs.quartier && <small className="err">{erreurs.quartier}</small>}

          <label htmlFor="souhait">Je souhaite</label>
          <select id="souhait" name="souhait" value={form.souhait} onChange={onChange}>
            <option value="">— Choisir —</option>
            {SOUHAITS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          {erreurs.souhait && <small className="err">{erreurs.souhait}</small>}

          <button type="submit" className="btn btn-primary btn-block" disabled={etat === 'envoi'}>
            {etat === 'envoi' ? 'Envoi…' : 'Envoyer mon adhésion'}
          </button>

          {etat === 'ok' && (
            <p className="form-ok">Merci ! WhatsApp s'ouvre avec ton bulletin : appuie sur « Envoyer » pour finaliser.</p>
          )}
          {etat === 'erreur' && <p className="err">Vérifie les champs signalés puis renvoie.</p>}
          <p className="form-foot">Ensemble, une jeunesse debout. 💪</p>
        </form>
      </div>
    </section>
  )
}
