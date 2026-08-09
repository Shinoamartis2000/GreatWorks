import { useState } from "react";
import { toast } from "sonner";
import { Mail, Phone, MapPin, Clock, Landmark, HelpCircle } from "lucide-react";
import { api } from "@/lib/api";
import { organisation } from "@/data/siteData";
import PageHeader from "@/components/PageHeader";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", topic: "General enquiry", message: "" });
  const [errors, setErrors] = useState({});

  const submitForm = async (event) => {
    event.preventDefault();
    const v = {};
    if (!form.name) v.name = "Full name is required";
    if (!form.email) v.email = "A valid email is required";
    if (!form.message) v.message = "Please enter your message";
    setErrors(v);
    if (Object.keys(v).length) return;
    await api.post("/contact", form);
    toast.success("Your message has been sent. We will respond during office hours.");
    setForm({ name: "", email: "", phone: "", topic: "General enquiry", message: "" });
  };

  const field = "h-12 w-full rounded-sm border border-gov-line px-4 text-sm text-gov-navy";

  return (
    <div>
      <PageHeader
        eyebrow="Contact"
        title="Contact GreatWorks Foundation"
        description="Reach our team for programme information, partnerships, or general enquiries. We respond during published office hours."
        breadcrumbs={[{ label: "Contact" }]}
        testId="contact-header"
      />

      <section className="bg-white py-14 md:py-20" data-testid="contact-page">
        <div className="gov-container grid gap-10 lg:grid-cols-[1fr_1.2fr]">
          {/* Office info + segmented contacts */}
          <div className="space-y-6">
            <div className="gov-card p-6">
              <h2 className="gov-h3">Registered office</h2>
              <ul className="mt-4 space-y-3 text-sm text-gov-charcoal">
                <li className="flex items-start gap-3"><MapPin className="mt-0.5 h-5 w-5 text-gov-blue" aria-hidden="true" /><span>{organisation.region}</span></li>
                <li className="flex items-center gap-3"><Mail className="h-5 w-5 text-gov-blue" aria-hidden="true" /><a href={`mailto:${organisation.email}`} className="gov-link">{organisation.email}</a></li>
                <li className="flex items-center gap-3"><Phone className="h-5 w-5 text-gov-blue" aria-hidden="true" /><a href={`tel:${organisation.phoneRaw}`} className="gov-link">{organisation.phone}</a></li>
                <li className="flex items-center gap-3"><Clock className="h-5 w-5 text-gov-blue" aria-hidden="true" /><span>{organisation.officeHours}</span></li>
              </ul>
            </div>

            <div className="gov-card border-l-4 border-gov-navy p-6" data-testid="contact-institutional">
              <div className="flex items-center gap-2"><Landmark className="h-5 w-5 text-gov-navy" aria-hidden="true" /><h3 className="font-serif text-base font-bold text-gov-navy">Government & Institutional Partnerships</h3></div>
              <p className="mt-2 text-sm text-gov-charcoal">For collaboration, funding, or CSR enquiries, please select "Partnership" in the form and our partnerships team will respond.</p>
            </div>

            <div className="gov-card border-l-4 border-gov-blue p-6" data-testid="contact-general">
              <div className="flex items-center gap-2"><HelpCircle className="h-5 w-5 text-gov-blue" aria-hidden="true" /><h3 className="font-serif text-base font-bold text-gov-navy">General Enquiries</h3></div>
              <p className="mt-2 text-sm text-gov-charcoal">For programme information, volunteering, or media enquiries, use the general enquiry option.</p>
            </div>
          </div>

          {/* Contact form */}
          <form className="gov-card p-6 md:p-8" onSubmit={submitForm} data-testid="contact-form" noValidate>
            <h2 className="gov-h3">Send an enquiry</h2>
            <div className="mt-6 grid gap-4">
              <div>
                <label htmlFor="c-name" className="text-sm font-semibold text-gov-navy">Full name</label>
                <input id="c-name" className={`mt-1 ${field}`} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} data-testid="contact-name-input" />
                {errors.name && <p className="mt-1 text-xs text-gov-red" data-testid="contact-name-error">{errors.name}</p>}
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="c-email" className="text-sm font-semibold text-gov-navy">Email</label>
                  <input id="c-email" type="email" className={`mt-1 ${field}`} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} data-testid="contact-email-input" />
                  {errors.email && <p className="mt-1 text-xs text-gov-red" data-testid="contact-email-error">{errors.email}</p>}
                </div>
                <div>
                  <label htmlFor="c-phone" className="text-sm font-semibold text-gov-navy">Phone (optional)</label>
                  <input id="c-phone" className={`mt-1 ${field}`} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} data-testid="contact-phone-input" />
                </div>
              </div>
              <div>
                <label htmlFor="c-topic" className="text-sm font-semibold text-gov-navy">Enquiry type</label>
                <select id="c-topic" className={`mt-1 ${field}`} value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })} data-testid="contact-topic-select">
                  <option>General enquiry</option>
                  <option>Partnership</option>
                  <option>Volunteering</option>
                  <option>Media</option>
                </select>
              </div>
              <div>
                <label htmlFor="c-message" className="text-sm font-semibold text-gov-navy">Message</label>
                <textarea id="c-message" className="mt-1 h-32 w-full rounded-sm border border-gov-line px-4 py-3 text-sm text-gov-navy" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} data-testid="contact-message-input" />
                {errors.message && <p className="mt-1 text-xs text-gov-red" data-testid="contact-message-error">{errors.message}</p>}
              </div>
              <button type="submit" className="gov-btn-primary w-full sm:w-auto" data-testid="contact-submit-button">Submit enquiry</button>
            </div>
          </form>
        </div>

        {/* Map */}
        <div className="gov-container mt-12">
          <div className="gov-card overflow-hidden" data-testid="contact-map">
            <iframe
              title="Enugu, Nigeria office location"
              src="https://www.google.com/maps?q=Enugu,%20Nigeria&output=embed"
              className="h-72 w-full border-0"
              loading="lazy"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
