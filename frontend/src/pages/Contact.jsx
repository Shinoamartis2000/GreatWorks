import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { contactMethods } from "@/data/siteData";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [errors, setErrors] = useState({});

  const submitForm = async (event) => {
    event.preventDefault();
    const validationErrors = {};
    if (!form.name) validationErrors.name = "Name is required";
    if (!form.email) validationErrors.email = "Email is required";
    if (!form.message) validationErrors.message = "Message is required";
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length) return;
    await api.post("/contact", { ...form, topic: "General" });
    toast.success("Message sent!");
    setForm({ name: "", email: "", phone: "", message: "" });
  };

  return (
    <motion.div className="section-gradient" data-testid="contact-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
      <section className="mx-auto max-w-7xl px-6 py-20 md:px-12">
        <p className="text-xs uppercase tracking-widest text-brand-muted">Contact</p>
        <h1 className="mt-3 font-serif text-4xl text-brand-forest">We are here to help</h1>
        <div className="mt-8 grid gap-10 md:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-6">
            {contactMethods.map((method, index) => (
              <div key={method.label} className="rounded-2xl bg-white/70 p-6 shadow-sm" data-testid={`contact-method-${index}`}>
                <p className="text-xs uppercase tracking-widest text-brand-muted">{method.label}</p>
                <p className="mt-2 text-sm font-semibold text-brand-forest">{method.value}</p>
              </div>
            ))}
          </div>
          <form className="rounded-2xl bg-white/70 p-6 shadow-sm" onSubmit={submitForm}>
            <h2 className="font-serif text-2xl text-brand-forest">Send an inquiry</h2>
            <div className="mt-6 grid gap-4">
              <input
                type="text"
                placeholder="Full name"
                className="h-12 rounded-lg border border-brand-forest/20 px-4"
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                data-testid="contact-name-input"
              />
              <input
                type="email"
                placeholder="Email"
                className="h-12 rounded-lg border border-brand-forest/20 px-4"
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
                data-testid="contact-email-input"
              />
              <input
                type="text"
                placeholder="Phone"
                className="h-12 rounded-lg border border-brand-forest/20 px-4"
                value={form.phone}
                onChange={(event) => setForm({ ...form, phone: event.target.value })}
                data-testid="contact-phone-input"
              />
              <textarea
                placeholder="How can we help?"
                className="h-28 rounded-lg border border-brand-forest/20 px-4 py-3"
                value={form.message}
                onChange={(event) => setForm({ ...form, message: event.target.value })}
                data-testid="contact-message-input"
              />
              <button
                type="submit"
                className="rounded-full bg-brand-forest px-6 py-4 text-sm font-semibold text-white"
                data-testid="contact-submit-button"
              >
                Send message
              </button>
            </div>
          </form>
        </div>
      </section>
    </motion.div>
  );
};

export default Contact;
