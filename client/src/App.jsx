import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";

// ── Public site ───────────────────────────────────────────────────────────────
import Home from "./pages/Home";
import Work from "./pages/Work";
import Reels from "./pages/Reels";
import Highlights from "./pages/Highlights";
import Journals from "./pages/Journals";
import JournalDetail from "./pages/JournalDetail";
import Services from "./pages/Services";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";
import ScrollToTop from "./components/ScrollToTop";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// ── Admin ─────────────────────────────────────────────────────────────────────
import { AuthProvider, useAuth } from "./admin/context/AuthContext";
import AdminLayout from "./admin/components/Layout";
import AdminLogin from "./admin/pages/Login";
import AdminDashboard from "./admin/pages/Dashboard";
import AdminWork from "./admin/pages/Work";
import AdminReels from "./admin/pages/Reels";
import AdminHighlights from "./admin/pages/Highlights";
import AdminJournals from "./admin/pages/Journals";
import AdminJournalEditor from "./admin/pages/JournalEditor";

function ProtectedRoute({ children }) {
  const { authed } = useAuth();
  return authed ? children : <Navigate to="/admin/login" replace />;
}

// Wrapper that strips the Navbar/Footer from admin routes
function PublicSite() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/work" element={<Work />} />
        <Route path="/work/reels" element={<Reels />} />
        <Route path="/work/highlights" element={<Highlights />} />
        <Route path="/work/journals" element={<Journals />} />
        <Route path="/work/journals/:id" element={<JournalDetail />} />
        <Route path="/services" element={<Services />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ScrollToTop />
      <Toaster position="top-center" richColors closeButton />
      <Routes>
        {/* ── Admin routes (no Navbar/Footer) ── */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="work" element={<AdminWork />} />
          <Route path="reels" element={<AdminReels />} />
          <Route path="highlights" element={<AdminHighlights />} />
          <Route path="journals" element={<AdminJournals />} />
          <Route path="journals/new" element={<AdminJournalEditor />} />
          <Route path="journals/:id/edit" element={<AdminJournalEditor />} />
        </Route>

        {/* ── Public site ── */}
        <Route path="/*" element={<PublicSite />} />
      </Routes>
    </AuthProvider>
  );
}
