import { Route, Routes } from "react-router";
import Layout from "./components/Layout";
import Accueil from "./pages/Accueil";
import APropos from "./pages/APropos";
import President from "./pages/President";
import Contact from "./pages/Contact";
import Adherer from "./pages/Adherer";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Accueil />} />
        <Route path="a-propos" element={<APropos />} />
        <Route path="le-president" element={<President />} />
        <Route path="contact" element={<Contact />} />
        <Route path="adherer" element={<Adherer />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
