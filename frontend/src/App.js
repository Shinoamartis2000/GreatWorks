import "@/App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AuthCallback from "@/components/AuthCallback";
import ProtectedRoute from "@/components/ProtectedRoute";
import { AuthProvider } from "@/context/AuthContext";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Stories from "@/pages/Stories";
import StoryDetail from "@/pages/StoryDetail";
import Gallery from "@/pages/Gallery";
import Donate from "@/pages/Donate";
import GetInvolved from "@/pages/GetInvolved";
import Contact from "@/pages/Contact";
import Admin from "@/pages/Admin";
import Login from "@/pages/Login";

const AppRoutes = () => {
  const location = useLocation();
  if (location.hash?.includes("session_id=")) {
    const sessionId = location.hash.split("session_id=")[1]?.split("&")[0];
    return <AuthCallback sessionId={sessionId} />;
  }
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/stories" element={<Stories />} />
      <Route path="/stories/:slug" element={<StoryDetail />} />
      <Route path="/gallery" element={<Gallery />} />
      <Route path="/donate" element={<Donate />} />
      <Route path="/get-involved" element={<GetInvolved />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute roles={["Admin", "Editor"]}>
            <Admin />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="App">
          <Navbar />
          <main className="pt-20">
            <AppRoutes />
          </main>
          <Footer />
          <Toaster richColors />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
