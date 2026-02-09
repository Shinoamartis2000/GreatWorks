import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Stories from "@/pages/Stories";
import StoryDetail from "@/pages/StoryDetail";
import Gallery from "@/pages/Gallery";
import Donate from "@/pages/Donate";
import GetInvolved from "@/pages/GetInvolved";
import Contact from "@/pages/Contact";
import Admin from "@/pages/Admin";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Navbar />
        <main className="pt-20">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/stories" element={<Stories />} />
            <Route path="/stories/:slug" element={<StoryDetail />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/donate" element={<Donate />} />
            <Route path="/get-involved" element={<GetInvolved />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
        <Footer />
        <Toaster richColors />
      </div>
    </BrowserRouter>
  );
}

export default App;
