import { Link } from "react-router";
import PageHeader from "../components/PageHeader";
import { site } from "../config/site";

const piliers = [
  {
    titre: "Notre mission",
    texte:
      "Rassembler les citoyens autour d'un projet commun, porter leurs aspirations et proposer des solutions concrètes aux défis de notre époque.",
  },
  {
    titre: "Notre vision",
    texte:
      "Une société plus juste, plus unie et tournée vers l'avenir, où chaque citoyen peut contribuer au progrès collectif.",
  },
  {
    titre: "Notre action",
    texte:
      "Des rencontres, des actions de terrain et des propositions portées à tous les niveaux pour faire avancer nos idées.",
  },
];

export default function APropos() {
  return (
    <>
      <PageHeader title="À propos" subtitle={`Découvrez l'histoire et les ambitions du ${site.sigle}.`} />

      <section className="section">
        <div className="container prose">
          <h2>Qui sommes-nous ?</h2>
          <p>
            Le {site.nomComplet} est un mouvement de citoyens engagés. Il est né de la volonté de
            rassembler toutes celles et ceux qui souhaitent agir concrètement pour le bien commun.
          </p>
          <p>
            Présentez ici l'histoire du mouvement : sa date de création, ses fondateurs, les
            circonstances de sa naissance et les grandes étapes qui ont marqué son développement.
          </p>
        </div>
      </section>

      <section className="section section--alt">
        <div className="container">
          <div className="cards">
            {piliers.map((p) => (
              <article key={p.titre} className="card">
                <h3>{p.titre}</h3>
                <p>{p.texte}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container prose">
          <h2>Notre organisation</h2>
          <p>
            Le mouvement est dirigé par un bureau exécutif placé sous l'autorité de son Président,{" "}
            <Link to="/le-president">{site.president.nom}</Link>. Il s'appuie sur un réseau de
            militants et de responsables locaux présents sur l'ensemble du territoire.
          </p>
          <Link to="/adherer" className="btn btn--primary">
            Rejoindre le mouvement
          </Link>
        </div>
      </section>
    </>
  );
}
