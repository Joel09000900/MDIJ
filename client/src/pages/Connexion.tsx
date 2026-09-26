import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { connexion } from '../api'
import { enregistrerJeton } from '../session'

/** Page « Connexion » : accès réservé au président du mouvement. */
export default function Connexion() {
  const [motDePasse, setMotDePasse] = useState('')
  const [erreur, setErreur] = useState('')
  const [envoi, setEnvoi] = useState(false)
  const naviguer = useNavigate()

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!motDePasse) {
      setErreur('Saisis ton mot de passe.')
      return
    }

    setEnvoi(true)
    setErreur('')
    try {
      const rep = await connexion(motDePasse)
      if (!rep.ok || !rep.token) {
        setErreur(rep.error ?? 'Connexion impossible.')
        return
      }
      enregistrerJeton(rep.token)
      naviguer('/administration', { replace: true })
    } catch {
      setErreur("Le serveur ne répond pas. Vérifie que l'API est démarrée.")
    } finally {
      setEnvoi(false)
    }
  }

  return (
    <section className="section section-alt">
      <div className="container connexion">
        <form className="card form" onSubmit={onSubmit} noValidate>
          <span className="section-tag">Espace réservé</span>
          <h1 className="connexion-titre">Connexion</h1>
          <p className="form-hint">
            Cet espace est réservé au président du MDIJ. Il donne accès aux statistiques et aux demandes d'adhésion.
          </p>

          <label htmlFor="motDePasse">Mot de passe</label>
          <input
            id="motDePasse"
            name="motDePasse"
            type="password"
            autoComplete="current-password"
            value={motDePasse}
            onChange={(e) => {
              setMotDePasse(e.target.value)
              setErreur('')
            }}
          />
          {erreur && <small className="err">{erreur}</small>}

          <button type="submit" className="btn btn-primary btn-block" disabled={envoi}>
            {envoi ? 'Connexion…' : 'Me connecter'}
          </button>
        </form>
      </div>
    </section>
  )
}
