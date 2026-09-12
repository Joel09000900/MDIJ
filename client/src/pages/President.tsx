import { Link } from "react-router";
import PageHeader from "../components/PageHeader";
import { initiales, site } from "../config/site";

const parcours = [
  { annee: "20XX", texte: "Étape marquante du parcours (formation, premier engagement…)." },
  { annee: "20XX", texte: "Responsabilités professionnelles ou associatives." },
  { annee: "20XX", texte: "Fondation ou élection à la tête du mouvement." },
];

export default function President() {
  return (
    <>
      <PageHeader title="Le Président" subtitle={site.president.titre} />

      <section className="section">
        <div className="container split">
          <div className="portrait portrait--lg" aria-hidden="true">
            {initiales(site.president.nom)}
          </div>
          <div className="prose">
            <h2>{site.president.nom}</h2>
            <p>
              Présentez ici le Président du mouvement : son parcours, ses engagements et les
              convictions qui l'animent.
            </p>
            <p>
              Cette biographie peut évoquer sa formation, son expérience professionnelle, ses
              engagements associatifs ou politiques, ainsi que les raisons qui l'ont conduit à
              prendre la tête du {site.sigle}.
            </p>
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className="container">
          <div className="section__head">
            <h2>Son parcours</h2>
          </div>
          <ol className="timeline">
            {parcours.map((etape, i) => (
              <li key={i}>
                <span className="timeline__year">{etape.annee}</span>
                <p>{etape.texte}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section">
        <div className="container prose">
          <h2>Le message du Président</h2>
          <blockquote className="quote">
            « Notre mouvement est né d'une conviction : c'est ensemble que nous bâtirons un avenir
            meilleur. À chacune et chacun d'entre vous, je dis : votre engagement compte. Rejoignez-
            nous. »
          </blockquote>
          <p className="quote__author">— {site.president.nom}</p>
          <Link to="/adherer" className="btn btn--accent">
            Adhérer au mouvement
          </Link>
        </div>
      </section>
    </>
  );
}
