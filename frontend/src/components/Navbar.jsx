import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Facebook,
  Instagram,
  Twitter,
  Menu,
  Search,
  Phone,
  Type,
  Contrast,
  ChevronDown,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { navLinks, organisation } from "@/data/siteData";

const applyA11y = (fontStep, contrast) => {
  const el = document.documentElement;
  el.classList.remove("a11y-font-1", "a11y-font-2");
  if (fontStep === 1) el.classList.add("a11y-font-1");
  if (fontStep === 2) el.classList.add("a11y-font-2");
  el.classList.toggle("a11y-contrast", contrast);
};

const Navbar = () => {
  const navigate = useNavigate();
  const [language, setLanguage] = useState("EN");
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [fontStep, setFontStep] = useState(() => Number(localStorage.getItem("a11yFont") || 0));
  const [contrast, setContrast] = useState(() => localStorage.getItem("a11yContrast") === "1");

  useEffect(() => {
    applyA11y(fontStep, contrast);
    localStorage.setItem("a11yFont", String(fontStep));
    localStorage.setItem("a11yContrast", contrast ? "1" : "0");
  }, [fontStep, contrast]);

  const runSearch = (event) => {
    event.preventDefault();
    if (!query.trim()) return;
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    setSearchOpen(false);
  };

  const navItemClass = ({ isActive }) =>
    `border-b-2 py-4 text-sm font-semibold transition-colors duration-200 ${
      isActive
        ? "border-gov-blue text-gov-navy"
        : "border-transparent text-gov-charcoal hover:text-gov-blue"
    }`;

  return (
    <header className="w-full" data-testid="site-header">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:z-[60] focus:rounded-sm focus:bg-gov-navy focus:px-4 focus:py-2 focus:text-sm focus:text-white"
        data-testid="skip-to-content"
      >
        Skip to main content
      </a>

      {/* Utility bar */}
      <div className="bg-gov-navy text-white">
        <div className="gov-container flex flex-wrap items-center justify-between gap-y-2 py-2 text-xs">
          <div className="flex items-center gap-4">
            <a
              href={`tel:${organisation.phoneRaw}`}
              className="flex items-center gap-1.5 text-white/90 transition-colors duration-200 hover:text-white"
              data-testid="utility-helpline"
            >
              <Phone className="h-3.5 w-3.5" aria-hidden="true" />
              Helpline: {organisation.phone}
            </a>
            <span className="hidden text-white/40 sm:inline" aria-hidden="true">|</span>
            <a
              href={`mailto:${organisation.email}`}
              className="hidden text-white/90 transition-colors duration-200 hover:text-white sm:inline"
              data-testid="utility-email"
            >
              {organisation.email}
            </a>
          </div>

          <div className="flex items-center gap-3">
            {/* Text resize */}
            <div className="flex items-center gap-1" role="group" aria-label="Text size">
              <Type className="h-3.5 w-3.5 text-white/70" aria-hidden="true" />
              <button
                onClick={() => setFontStep((s) => Math.max(0, s - 1))}
                className="rounded-sm px-1.5 py-0.5 text-white/90 transition-colors duration-200 hover:bg-white/15"
                aria-label="Decrease text size"
                data-testid="a11y-font-decrease"
              >
                A-
              </button>
              <button
                onClick={() => setFontStep((s) => Math.min(2, s + 1))}
                className="rounded-sm px-1.5 py-0.5 text-white/90 transition-colors duration-200 hover:bg-white/15"
                aria-label="Increase text size"
                data-testid="a11y-font-increase"
              >
                A+
              </button>
            </div>
            <button
              onClick={() => setContrast((c) => !c)}
              className="flex items-center gap-1 rounded-sm px-1.5 py-0.5 text-white/90 transition-colors duration-200 hover:bg-white/15"
              aria-pressed={contrast}
              aria-label="Toggle high contrast"
              data-testid="a11y-contrast-toggle"
            >
              <Contrast className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">Contrast</span>
            </button>
            <button
              onClick={() => setLanguage(language === "EN" ? "FR" : "EN")}
              className="flex items-center gap-1 rounded-sm px-1.5 py-0.5 text-white/90 transition-colors duration-200 hover:bg-white/15"
              data-testid="utility-language"
            >
              {language}
              <ChevronDown className="h-3 w-3" aria-hidden="true" />
            </button>
            <div className="hidden items-center gap-2 md:flex">
              <a href={organisation.socials.facebook} target="_blank" rel="noreferrer" aria-label="Facebook" data-testid="utility-facebook" className="text-white/80 transition-colors duration-200 hover:text-white">
                <Facebook className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
              <a href={organisation.socials.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" data-testid="utility-instagram" className="text-white/80 transition-colors duration-200 hover:text-white">
                <Instagram className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
              <a href={organisation.socials.x} target="_blank" rel="noreferrer" aria-label="X (formerly Twitter)" data-testid="utility-x" className="text-white/80 transition-colors duration-200 hover:text-white">
                <Twitter className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="border-b border-gov-line bg-white">
        <div className="gov-container flex items-center justify-between gap-4 py-4">
          <Link to="/" className="flex items-center gap-3" data-testid="nav-logo-link">
            <img
              src="/logo.jpeg"
              alt="GreatWorks Foundation logo"
              className="h-14 w-14 rounded-sm border border-gov-line object-cover"
            />
            <div className="leading-tight">
              <p className="font-serif text-lg font-bold text-gov-navy sm:text-xl">
                GreatWorks Foundation
              </p>
              <p className="text-xs uppercase tracking-[0.16em] text-gov-slate">
                {organisation.tagline}
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <div className="hidden items-center lg:flex">
              {searchOpen ? (
                <form onSubmit={runSearch} className="flex items-center" role="search">
                  <label htmlFor="site-search" className="sr-only">Search the website</label>
                  <input
                    id="site-search"
                    autoFocus
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search projects, publications, news…"
                    className="h-10 w-64 rounded-sm border border-gov-line px-3 text-sm"
                    data-testid="site-search-input"
                  />
                  <button type="submit" className="ml-2 gov-btn-primary px-4 py-2" data-testid="site-search-submit">
                    Search
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="flex items-center gap-2 rounded-sm border border-gov-line px-3 py-2 text-sm text-gov-charcoal transition-colors duration-200 hover:bg-gov-mist"
                  data-testid="site-search-open"
                  aria-label="Open search"
                >
                  <Search className="h-4 w-4" aria-hidden="true" />
                  Search
                </button>
              )}
            </div>
            <Link to="/donate" className="gov-btn-primary" data-testid="nav-donate-button">
              Donate
            </Link>

            {/* Mobile menu */}
            <div className="lg:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <button className="rounded-sm border border-gov-line p-2.5" aria-label="Open menu" data-testid="nav-hamburger-button">
                    <Menu className="h-5 w-5 text-gov-navy" />
                  </button>
                </SheetTrigger>
                <SheetContent className="w-80 bg-white">
                  <form onSubmit={runSearch} className="mt-8 flex items-center" role="search">
                    <input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search…"
                      className="h-11 w-full rounded-sm border border-gov-line px-3 text-sm"
                      data-testid="mobile-search-input"
                    />
                    <button type="submit" className="ml-2 gov-btn-primary px-4 py-2.5" data-testid="mobile-search-submit">
                      <Search className="h-4 w-4" />
                    </button>
                  </form>
                  <nav className="mt-6 flex flex-col" aria-label="Mobile navigation">
                    {navLinks.map((link) => (
                      <SheetClose asChild key={link.path}>
                        <NavLink
                          to={link.path}
                          className="border-b border-gov-line py-3 text-base font-semibold text-gov-navy"
                          data-testid={`mobile-${link.testId}`}
                        >
                          {link.name}
                        </NavLink>
                      </SheetClose>
                    ))}
                    <SheetClose asChild>
                      <Link to="/donate" className="mt-6 gov-btn-primary" data-testid="mobile-donate-button">
                        Donate
                      </Link>
                    </SheetClose>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>

        {/* Primary navigation */}
        <nav className="hidden border-t border-gov-line bg-white lg:block" aria-label="Primary navigation">
          <div className="gov-container flex items-center gap-7">
            <NavLink to="/" end className={navItemClass} data-testid="nav-link-home">
              Home
            </NavLink>
            {navLinks.map((link) => (
              <NavLink key={link.path} to={link.path} className={navItemClass} data-testid={link.testId}>
                {link.name}
              </NavLink>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
