import { Link } from "react-router";
import { initiales, site } from "../config/site";

const valeurs = [
  {
    icone: "🤝",
    titre: "Solidarité",
    texte: "Nous croyons en une société où chacun trouve sa place et où personne n'est laissé de côté.",
  },
  {
    icone: "⚖️",
    titre: "Justice",
    texte: "Nous défendons l'égalité des chances et le respect des droits de tous les citoyens.",
  },
  {
    icone: "🌱",
    titre: "Engagement",
    texte: "Nous agissons sur le terrain, au plus près des préoccupations de la population.",
  },
];

export default function Accueil() {
  return (
    <>
      <title>{`Accueil | ${site.sigle}`}</title>

      <section className="hero">
        <div className="container hero__inner">
          <p className="hero__eyebrow">Bienvenue au {site.sigle}</p>
          <h1>{site.slogan}</h1>
          <p className="hero__lead">
            Le {site.nomComplet} rassemble des femmes et des hommes engagés pour porter un projet
            ambitieux au service de tous.
          </p>
          <div className="hero__actions">
            <Link to="/adherer" className="btn btn--accent btn--lg">
              Adhérer au mouvement
            </Link>
            <Link to="/a-propos" className="btn btn--ghost btn--lg">
              Découvrir le mouvement
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section__head">
            <h2>Nos valeurs</h2>
            <p>Les principes qui guident chacune de nos actions.</p>
          </div>
          <div className="cards">
            {valeurs.map((v) => (
              <article key={v.titre} className="card">
                <span className="card__icon" aria-hidden="true">
                  {v.icone}
                </span>
                <h3>{v.titre}</h3>
                <p>{v.texte}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className="container split">
          <div className="portrait" aria-hidden="true">
            {initiales(site.president.nom)}
          </div>
          <div>
            <p className="eyebrow">Le mot du Président</p>
            <h2>{site.president.nom}</h2>
            <blockquote className="quote">
              « Notre mouvement est né d'une conviction : c'est ensemble que nous bâtirons un avenir
              meilleur. Je vous invite à nous rejoindre. »
            </blockquote>
            <Link to="/le-president" className="btn btn--primary">
              En savoir plus
            </Link>
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="container cta__inner">
          <div>
            <h2>Rejoignez le mouvement</h2>
            <p>Chaque voix compte. Engagez-vous à nos côtés dès aujourd'hui.</p>
          </div>
          <Link to="/adherer" className="btn btn--accent btn--lg">
            J'adhère
          </Link>
        </div>
      </section>
    </>
  );
}
