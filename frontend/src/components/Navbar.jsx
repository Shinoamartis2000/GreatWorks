import { useState } from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Menu, Twitter } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { navLinks } from "@/data/siteData";

const Navbar = () => {
  const [language, setLanguage] = useState("EN");

  return (
    <header
      className="fixed top-0 z-50 w-full border-b border-white/40 bg-[#f5f6fb]/90 backdrop-blur-md"
      data-testid="site-header"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-12">
        <Link to="/" className="flex items-center gap-3" data-testid="nav-logo-link">
          <img src="/logo.jpeg" alt="GreatWorks Foundation" className="h-12 w-12 rounded-full object-cover" />
          <div>
            <p className="font-serif text-lg font-bold text-brand-forest">GreatWorks</p>
            <p className="text-xs uppercase tracking-[0.3em] text-brand-muted">Foundation</p>
            <p className="text-xs text-brand-muted">Rebuilding Lives for the Future</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="text-sm font-medium text-brand-slate transition hover:text-brand-forest"
              data-testid={link.testId}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-brand-forest" data-testid="social-handle">@greatworksf</span>
            <a
              href="https://facebook.com/greatworksf"
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-brand-forest/20 p-2 text-brand-forest transition hover:-translate-y-0.5"
              data-testid="nav-social-facebook"
            >
              <Facebook className="h-4 w-4" />
            </a>
            <a
              href="https://instagram.com/greatworksf"
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-brand-forest/20 p-2 text-brand-forest transition hover:-translate-y-0.5"
              data-testid="nav-social-instagram"
            >
              <Instagram className="h-4 w-4" />
            </a>
            <a
              href="https://x.com/greatworksf"
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-brand-forest/20 p-2 text-brand-forest transition hover:-translate-y-0.5"
              data-testid="nav-social-x"
            >
              <Twitter className="h-4 w-4" />
            </a>
          </div>
          <button
            className="rounded-full border border-brand-forest px-4 py-2 text-xs font-semibold text-brand-forest transition hover:-translate-y-0.5"
            onClick={() => setLanguage(language === "EN" ? "FR" : "EN")}
            data-testid="nav-language-toggle"
          >
            {language}
          </button>
          <Link
            to="/donate"
            className="rounded-full bg-brand-forest px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5"
            data-testid="nav-donate-button"
          >
            Donate
          </Link>
        </div>

        <div className="lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <button className="rounded-full border border-brand-forest/30 p-2" data-testid="nav-hamburger-button">
                <Menu className="h-5 w-5 text-brand-forest" />
              </button>
            </SheetTrigger>
            <SheetContent className="bg-[#F4F1DE]">
              <div className="flex flex-col gap-4 pt-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="text-base font-medium text-brand-slate"
                    data-testid={`mobile-${link.testId}`}
                  >
                    {link.name}
                  </Link>
                ))}
                <button
                  className="rounded-full border border-brand-forest px-4 py-2 text-sm font-semibold text-brand-forest"
                  onClick={() => setLanguage(language === "EN" ? "FR" : "EN")}
                  data-testid="mobile-language-toggle"
                >
                  Language: {language}
                </button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
