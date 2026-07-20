import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import BackToTop from "./components/BackToTop";
import HomePage from "./pages/HomePage";
import ProjectsPage from "./pages/ProjectsPage";
import HighlightsPage from "./pages/HighlightsPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-[radial-gradient(circle_at_top_left,rgba(97,0,148,0.12),transparent_35%),linear-gradient(135deg,#ffffff_0%,#f7f3fb_100%)] text-black">
      <Header />

      <main className="flex-1 flex flex-col min-h-screen pt-24 sm:pt-20">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/highlights" element={<HighlightsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
      </main>

      <Footer />
      <BackToTop />
    </div>
  );
}
