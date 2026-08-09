import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";
import { api } from "@/lib/api";
import { footerColumns, organisation } from "@/data/siteData";

const Footer = () => {
  const [email, setEmail] = useState("");

  const submitNewsletter = async (event) => {
    event.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }
    await api.post("/newsletter", { email });
    toast.success("You have been added to our updates list.");
    setEmail("");
  };

  return (
    <footer className="bg-gov-navy text-white" data-testid="site-footer">
      <div className="gov-container grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-3">
            <img src="/logo.jpeg" alt="GreatWorks Foundation logo" className="h-12 w-12 rounded-sm object-cover" />
            <div className="leading-tight">
              <p className="font-serif text-lg font-bold" data-testid="footer-brand-title">GreatWorks Foundation</p>
              <p className="text-xs uppercase tracking-[0.14em] text-white/60">{organisation.tagline}</p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-white/75">{organisation.mission}</p>
          <div className="mt-5 space-y-2 text-sm text-white/80">
            <p className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 text-white/60" aria-hidden="true" />{organisation.region}</p>
            <a href={`mailto:${organisation.email}`} className="flex items-center gap-2 transition-colors duration-200 hover:text-white"><Mail className="h-4 w-4 text-white/60" aria-hidden="true" />{organisation.email}</a>
            <a href={`tel:${organisation.phoneRaw}`} className="flex items-center gap-2 transition-colors duration-200 hover:text-white"><Phone className="h-4 w-4 text-white/60" aria-hidden="true" />{organisation.phone}</a>
          </div>
        </div>

        {footerColumns.map((column) => (
          <div key={column.heading}>
            <h4 className="font-serif text-sm font-bold uppercase tracking-[0.12em] text-white">{column.heading}</h4>
            <ul className="mt-4 space-y-2.5">
              {column.links.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-white/75 transition-colors duration-200 hover:text-white"
                    data-testid={`footer-link-${link.path.replace("/", "") || "home"}`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
              {column.heading === "Engage" && (
                <li>
                  <form onSubmit={submitNewsletter} className="mt-4">
                    <label htmlFor="footer-newsletter" className="text-xs font-semibold uppercase tracking-[0.12em] text-white/60">
                      Subscribe to updates
                    </label>
                    <div className="mt-2 flex">
                      <input
                        id="footer-newsletter"
                        type="email"
                        placeholder="Email address"
                        className="h-10 w-full rounded-sm border border-white/20 bg-white/10 px-3 text-sm text-white placeholder:text-white/50"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        data-testid="footer-newsletter-input"
                      />
                      <button type="submit" className="ml-2 rounded-sm bg-white px-3 text-sm font-semibold text-gov-navy" data-testid="footer-newsletter-submit">
                        Join
                      </button>
                    </div>
                  </form>
                </li>
              )}
            </ul>
          </div>
        ))}
      </div>

      {/* Legal / institutional bar */}
      <div className="border-t border-white/15">
        <div className="gov-container flex flex-col items-start justify-between gap-4 py-5 text-xs text-white/60 md:flex-row md:items-center">
          <p data-testid="footer-legal">
            © {new Date().getFullYear()} GreatWorks Foundation. All rights reserved. Non-profit organisation operating in Enugu, Nigeria.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link to="/publications" className="transition-colors duration-200 hover:text-white">Privacy Policy</Link>
            <Link to="/publications" className="transition-colors duration-200 hover:text-white">Terms</Link>
            <Link to="/contact" className="transition-colors duration-200 hover:text-white">Accessibility</Link>
            <div className="flex items-center gap-3">
              <a href={organisation.socials.facebook} target="_blank" rel="noreferrer" aria-label="Facebook" className="hover:text-white"><Facebook className="h-4 w-4" /></a>
              <a href={organisation.socials.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className="hover:text-white"><Instagram className="h-4 w-4" /></a>
              <a href={organisation.socials.x} target="_blank" rel="noreferrer" aria-label="X" className="hover:text-white"><Twitter className="h-4 w-4" /></a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
