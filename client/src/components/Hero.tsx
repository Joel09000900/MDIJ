import { Link } from 'react-router-dom'

export default function Hero() {
  return (
    <section id="accueil" className="hero">
      <div className="container hero-inner">
        <div className="hero-text">
          <span className="badge">Côte d'Ivoire · Yopougon</span>
          <h1>
            Donne ta voix. <span className="accent">Bâtis ton avenir.</span>
          </h1>
          <p className="hero-lead">
            Le Mouvement Démocratique pour l'Insertion des Jeunes rend à la jeunesse ivoirienne sa place : sociale,
            culturelle, économique et politique. L'heure des spectateurs est terminée.
          </p>
          <div className="hero-actions">
            <Link to="/rejoindre" className="btn btn-primary">Je rejoins le combat</Link>
            <Link to="/#about" className="btn btn-outline">Découvrir le MDIJ</Link>
          </div>
        </div>

        <figure className="hero-visual">
          <img src="/images/meeting.jpg" alt="Meeting du MDIJ à Yopougon" />
          <figcaption className="hero-quote">
            <strong>"Une jeunesse insérée, c'est une nation debout."</strong>
            <span>— Konan Famien, Président</span>
          </figcaption>
        </figure>
      </div>
    </section>
  )
}
