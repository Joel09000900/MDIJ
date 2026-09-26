import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { chargerTableau } from '../api'
import Barres from '../components/admin/Barres'
import BarreEmpilee from '../components/admin/BarreEmpilee'
import Carte from '../components/admin/Carte'
import Colonnes from '../components/admin/Colonnes'
import Jauge from '../components/admin/Jauge'
import Tuile from '../components/admin/Tuile'
import { effacerJeton, lireJeton } from '../session'
import { compter, dateHeure, depuis, parJour } from '../stats'
import type { Inscrit } from '../types'

type Etat = 'chargement' | 'ok' | 'erreur'

const TOUTES = 'Toutes'

/** Prépare un fichier CSV téléchargeable à partir des lignes affichées. */
function versCsv(lignes: Inscrit[]): string {
  const entetes = ['Nom', 'Téléphone', 'Quartier', 'Commune', 'Activité', 'Détail', 'Fiche', 'Souhait', 'Source', 'Date']
  const echappe = (v: string | number | null) => `"${String(v ?? '').replace(/"/g, '""')}"`
  const corps = lignes.map((i) =>
    [i.nom, i.telephone, i.quartier, i.commune, i.activite, i.activiteDetail, i.fiche, i.souhait, i.source, i.date]
      .map(echappe)
      .join(';'),
  )
  return [entetes.join(';'), ...corps].join('\n')
}

export default function Administration() {
  const [inscrits, setInscrits] = useState<Inscrit[]>([])
  const [etat, setEtat] = useState<Etat>('chargement')
  const [erreur, setErreur] = useState('')
  const naviguer = useNavigate()

  // filtres : ils pilotent tous les visuels de la page en même temps
  const [recherche, setRecherche] = useState('')
  const [activite, setActivite] = useState(TOUTES)
  const [commune, setCommune] = useState(TOUTES)
  const [source, setSource] = useState<string>(TOUTES)

  useEffect(() => {
    const jeton = lireJeton()
    if (!jeton) {
      naviguer('/connexion', { replace: true })
      return
    }

    let vivant = true
    chargerTableau(jeton)
      .then((rep) => {
        if (!vivant) return
        if (!rep.ok) {
          effacerJeton()
          naviguer('/connexion', { replace: true })
          return
        }
        setInscrits(rep.inscrits ?? [])
        setEtat('ok')
      })
      .catch(() => {
        if (!vivant) return
        setErreur("Le serveur ne répond pas. Vérifie que l'API est démarrée.")
        setEtat('erreur')
      })

    return () => {
      vivant = false
    }
  }, [naviguer])

  const activites = useMemo(
    () => [TOUTES, ...[...new Set(inscrits.map((i) => i.activite))].sort()],
    [inscrits],
  )
  const communes = useMemo(() => [TOUTES, ...[...new Set(inscrits.map((i) => i.commune))].sort()], [inscrits])
  const sources = useMemo(() => [TOUTES, ...[...new Set(inscrits.map((i) => i.source))].sort()], [inscrits])

  const vue = useMemo(() => {
    const q = recherche.trim().toLowerCase()
    return inscrits.filter((i) => {
      if (activite !== TOUTES && i.activite !== activite) return false
      if (commune !== TOUTES && i.commune !== commune) return false
      if (source !== TOUTES && i.source !== source) return false
      if (!q) return true
      return [i.nom, i.telephone ?? '', i.quartier, i.commune, i.activite, i.souhait ?? '']
        .some((v) => v.toLowerCase().includes(q))
    })
  }, [inscrits, recherche, activite, commune, source])

  const parActivite = useMemo(() => compter(vue, (i) => i.activite), [vue])
  const parCommune = useMemo(() => compter(vue, (i) => i.commune), [vue])
  const parQuartier = useMemo(() => compter(vue, (i) => i.quartier).slice(0, 8), [vue])
  const parFiche = useMemo(
    () => compter(vue.filter((i) => i.fiche !== null), (i) => `Fiche ${i.fiche}`),
    [vue],
  )
  const jours = useMemo(() => parJour(vue, 14), [vue])

  // la carte de chaleur se lit mieux ordonnée par effectif que par alphabet
  const listeActivites = useMemo(() => parActivite.map((p) => p.cle), [parActivite])
  const listeCommunes = useMemo(() => parCommune.map((p) => p.cle), [parCommune])

  const avecTelephone = vue.filter((i) => i.telephone).length
  const avecDetail = vue.filter((i) => i.activiteDetail).length
  const avecFiche = vue.filter((i) => i.fiche !== null).length

  const derniere = useMemo(() => {
    const dates = vue.map((i) => i.date).sort()
    return dates[dates.length - 1] ?? null
  }, [vue])

  const csv = useMemo(() => encodeURIComponent(versCsv(vue)), [vue])
  const filtreActif = recherche !== '' || activite !== TOUTES || commune !== TOUTES || source !== TOUTES

  function deconnexion() {
    effacerJeton()
    naviguer('/connexion', { replace: true })
  }

  function reinitialiser() {
    setRecherche('')
    setActivite(TOUTES)
    setCommune(TOUTES)
    setSource(TOUTES)
  }

  if (etat === 'chargement') {
    return (
      <section className="section">
        <div className="container">
          <p className="graphe-vide">Chargement du tableau de bord…</p>
        </div>
      </section>
    )
  }

  if (etat === 'erreur') {
    return (
      <section className="section">
        <div className="container">
          <p className="err">{erreur}</p>
          <button type="button" className="btn btn-outline-dark" onClick={deconnexion}>
            Revenir à la connexion
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="section admin">
      <div className="container">
        <header className="admin-entete">
          <div>
            <span className="section-tag">Espace du président</span>
            <h1 className="section-title">Tableau de bord</h1>
          </div>
          <div className="admin-actions">
            <a className="btn btn-outline-dark" href={`data:text/csv;charset=utf-8,${csv}`} download="mdij-membres.csv">
              Exporter en CSV
            </a>
            <button type="button" className="btn btn-outline-dark" onClick={deconnexion}>
              Se déconnecter
            </button>
          </div>
        </header>

        {/* Les filtres agissent sur tous les graphiques de la page à la fois. */}
        <div className="filtres">
          <input
            type="search"
            placeholder="Rechercher un nom, un quartier, un numéro…"
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            aria-label="Rechercher"
          />
          <label>
            Activité
            <select value={activite} onChange={(e) => setActivite(e.target.value)}>
              {activites.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </label>
          <label>
            Commune
            <select value={commune} onChange={(e) => setCommune(e.target.value)}>
              {communes.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </label>
          <label>
            Source
            <select value={source} onChange={(e) => setSource(e.target.value)}>
              {sources.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </label>
          {filtreActif && (
            <button type="button" className="filtres-raz" onClick={reinitialiser}>
              Tout afficher
            </button>
          )}
        </div>

        <div className="tuiles">
          <Tuile
            libelle={filtreActif ? 'Personnes filtrées' : 'Personnes au total'}
            valeur={vue.length}
            precision={filtreActif ? `sur ${inscrits.length} au total` : 'registre + site'}
            principale
          />
          <Tuile libelle="Quartiers couverts" valeur={new Set(vue.map((i) => i.quartier)).size} precision="après regroupement des doublons" />
          <Tuile libelle="Communes" valeur={new Set(vue.map((i) => i.commune)).size} />
          <Tuile libelle="Arrivées cette semaine" valeur={depuis(vue, 7)} precision="7 derniers jours" />
        </div>

        <div className="graphes">
          <article className="card graphe">
            <h2>Profil des membres</h2>
            <p className="graphe-sous">Répartition par activité déclarée.</p>
            <Barres parts={parActivite} vide="Aucune activité renseignée." />
          </article>

          <article className="card graphe">
            <h2>Répartition par commune</h2>
            <p className="graphe-sous">Part de chaque commune dans l'effectif affiché.</p>
            <BarreEmpilee parts={parCommune} />
          </article>

          <article className="card graphe graphe-large">
            <h2>Quartiers les plus mobilisés</h2>
            <p className="graphe-sous">
              Les huit premiers, après regroupement des orthographes (« Yop-Sud » et « Yopougon Sud » comptent ensemble).
            </p>
            <Barres parts={parQuartier} vide="Aucun quartier renseigné." />
          </article>

          <article className="card graphe graphe-large">
            <h2>Activité croisée avec la commune</h2>
            <p className="graphe-sous">Plus la case est foncée, plus l'effectif est important.</p>
            <Carte
              lignes={listeActivites}
              colonnes={listeCommunes}
              valeur={(a, c) => vue.filter((i) => i.activite === a && i.commune === c).length}
            />
          </article>

          <article className="card graphe">
            <h2>Avancement du recensement</h2>
            <p className="graphe-sous">Membres saisis par fiche de terrain.</p>
            <Barres parts={parFiche} vide="Aucune fiche renseignée." />
          </article>

          <article className="card graphe">
            <h2>Qualité des données</h2>
            <p className="graphe-sous">Ce qui manque encore dans les fiches affichées.</p>
            <div className="jauges">
              <Jauge libelle="Téléphone renseigné" rempli={avecTelephone} total={vue.length} precision="joignables" />
              <Jauge libelle="Activité détaillée" rempli={avecDetail} total={vue.length} />
              <Jauge libelle="Fiche d'origine connue" rempli={avecFiche} total={vue.length} />
            </div>
          </article>

          <article className="card graphe graphe-large">
            <h2>Arrivées des 14 derniers jours</h2>
            <p className="graphe-sous">Une colonne par jour, toutes sources confondues.</p>
            <Colonnes
              parts={jours}
              vide={
                derniere
                  ? `Aucune arrivée depuis 14 jours. La dernière remonte au ${dateHeure(derniere).slice(0, 10)}.`
                  : 'Aucune arrivée enregistrée.'
              }
            />
          </article>
        </div>

        <article className="card demandes">
          <header className="demandes-entete">
            <div>
              <h2>Liste des personnes</h2>
              <p className="graphe-sous">
                {vue.length} {vue.length > 1 ? 'lignes affichées' : 'ligne affichée'}
                {filtreActif ? ` sur ${inscrits.length}` : ''}.
              </p>
            </div>
          </header>

          {vue.length === 0 ? (
            <p className="graphe-vide">Aucune personne ne correspond à ces filtres.</p>
          ) : (
            <div className="table-enveloppe">
              <table className="table-demandes">
                <thead>
                  <tr>
                    <th>Nom &amp; prénoms</th>
                    <th>Quartier</th>
                    <th>Activité</th>
                    <th>Source</th>
                    <th>Enregistré le</th>
                    <th>Contact</th>
                  </tr>
                </thead>
                <tbody>
                  {vue.map((i) => (
                    <tr key={i.id}>
                      <td>
                        <strong>{i.nom}</strong>
                        {i.souhait && <small className="sous-ligne">{i.souhait}</small>}
                      </td>
                      <td>
                        {i.quartier}
                        <small className="sous-ligne">{i.commune}</small>
                      </td>
                      <td>
                        <span className="etiquette">{i.activite}</span>
                      </td>
                      <td>
                        <span className={`puce puce-${i.source === 'Registre' ? 'registre' : i.source === 'Site' ? 'site' : 'ancienne'}`}>
                          {i.source}
                        </span>
                      </td>
                      <td className="cellule-date">{dateHeure(i.date)}</td>
                      <td className="cellule-contact">
                        {i.telephone ? (
                          <>
                            <a
                              href={`https://wa.me/225${i.telephone.replace(/\D/g, '')}`}
                              target="_blank"
                              rel="noreferrer"
                            >
                              WhatsApp
                            </a>
                            <a href={`tel:${i.telephone.replace(/\s/g, '')}`}>{i.telephone}</a>
                          </>
                        ) : (
                          <span className="manquant">Numéro manquant</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </article>
      </div>
    </section>
  )
}
