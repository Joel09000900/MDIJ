import { useState } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import DonModal from './components/DonModal'
import Footer from './components/Footer'
import Header from './components/Header'
import Reveal from './components/Reveal'
import ScrollToHash from './components/ScrollToHash'
import WhatsAppFloat from './components/WhatsAppFloat'
import Accueil from './pages/Accueil'
import Administration from './pages/Administration'
import Connexion from './pages/Connexion'
import Contact from './pages/Contact'
import LePresident from './pages/LePresident'
import NosCombats from './pages/NosCombats'
import Rejoindre from './pages/Rejoindre'
import Services from './pages/Services'

export default function App() {
  const [donOuvert, setDonOuvert] = useState(false)
  const { pathname } = useLocation()

  return (
    <>
      <ScrollToHash />
      <Reveal />
      <Header />
      {/* la clé relance le fondu d'entrée à chaque changement de page */}
      <main className="page" key={pathname}>
        <Routes>
          <Route path="/" element={<Accueil />} />
          <Route path="/nos-combats" element={<NosCombats />} />
          <Route path="/services" element={<Services onDon={() => setDonOuvert(true)} />} />
          <Route path="/le-president" element={<LePresident />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/rejoindre" element={<Rejoindre />} />
          <Route path="/connexion" element={<Connexion />} />
          <Route path="/administration" element={<Administration />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
      <DonModal open={donOuvert} onClose={() => setDonOuvert(false)} />
      <WhatsAppFloat />
    </>
  )
}
