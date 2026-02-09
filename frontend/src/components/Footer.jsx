import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Facebook, Instagram, Twitter } from "lucide-react";
import { api, buildFileUrl } from "@/lib/api";
import { navLinks } from "@/data/siteData";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [reportUrl, setReportUrl] = useState("");

  useEffect(() => {
    const fetchReport = async () => {
      const { data } = await api.get("/annual-reports");
      if (data?.length) {
        setReportUrl(buildFileUrl(data[0].file_url));
      }
    };
    fetchReport();
  }, []);

  const submitNewsletter = async (event) => {
    event.preventDefault();
    if (!email) {
      toast.error("Please enter your email");
      return;
    }
    await api.post("/newsletter", { email });
    toast.success("You are on the list!");
    setEmail("");
  };

  return (
    <footer className="border-t border-brand-forest/10 bg-[#E9E4D2]" data-testid="site-footer">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-12 md:grid-cols-3 md:px-12">
        <div>
          <h3 className="font-serif text-2xl text-brand-forest" data-testid="footer-brand-title">
            GreatWorks Foundation
          </h3>
          <p className="mt-3 text-sm text-brand-muted">
            Rebuilding Lives for the Future. Transparent, urgent, and hopeful relief.
          </p>
          <div className="mt-4 flex items-center gap-3" data-testid="footer-social-links">
            <a href="https://facebook.com/greatworksf" target="_blank" rel="noreferrer" data-testid="footer-facebook">
              <Facebook className="h-4 w-4 text-brand-forest" />
            </a>
            <a href="https://instagram.com/greatworksf" target="_blank" rel="noreferrer" data-testid="footer-instagram">
              <Instagram className="h-4 w-4 text-brand-forest" />
            </a>
            <a href="https://x.com/greatworksf" target="_blank" rel="noreferrer" data-testid="footer-x">
              <Twitter className="h-4 w-4 text-brand-forest" />
            </a>
          </div>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-widest text-brand-muted">Explore</h4>
          <div className="mt-4 flex flex-col gap-2">
            {navLinks.slice(0, 6).map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-sm text-brand-slate hover:text-brand-forest"
                data-testid={`footer-${link.testId}`}
              >
                {link.name}
              </Link>
            ))}
            {reportUrl && (
              <a
                href={reportUrl}
                className="text-sm text-brand-slate hover:text-brand-forest"
                data-testid="footer-annual-report-link"
              >
                Download Annual Report
              </a>
            )}
          </div>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-widest text-brand-muted">Newsletter</h4>
          <form className="mt-4 flex flex-col gap-3" onSubmit={submitNewsletter}>
            <input
              type="email"
              placeholder="Your email"
              className="h-11 rounded-lg border border-brand-forest/20 bg-white/60 px-4 text-sm"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              data-testid="footer-newsletter-input"
            />
            <button
              type="submit"
              className="rounded-full bg-brand-forest px-5 py-3 text-sm font-semibold text-white"
              data-testid="footer-newsletter-submit"
            >
              Join the community
            </button>
          </form>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
