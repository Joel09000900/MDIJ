import About from '../components/About'
import Hero from '../components/Hero'
import Services from '../components/Services'

/** Accueil : présentation, mouvement et services. Le bulletin est sur /rejoindre. */
export default function Accueil({ onDon }: { onDon: () => void }) {
  return (
    <>
      <Hero />
      <About />
      <Services onDon={onDon} />
    </>
  )
}
