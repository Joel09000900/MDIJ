import { Link } from "react-router";
import PageHeader from "../components/PageHeader";

export default function NotFound() {
  return (
    <>
      <PageHeader title="Page introuvable" subtitle="La page que vous cherchez n'existe pas." />
      <section className="section">
        <div className="container prose">
          <Link to="/" className="btn btn--primary">
            Retour à l'accueil
          </Link>
        </div>
      </section>
    </>
  );
}
