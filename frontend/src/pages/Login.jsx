import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

const Login = () => {
  const { loginWithJWT, registerWithJWT, loginWithGoogle } = useAuth();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "Volunteer" });

  const submitForm = async (event) => {
    event.preventDefault();
    if (mode === "login") {
      await loginWithJWT(form.email, form.password);
    } else {
      await registerWithJWT(form);
    }
  };

  return (
    <motion.div className="section-gradient" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
      <section className="mx-auto max-w-xl px-6 py-20 md:px-12" data-testid="login-page">
        <h1 className="font-serif text-4xl text-brand-forest">Sign in to GreatWorks</h1>
        <p className="mt-2 text-sm text-brand-muted">Choose Google OAuth or email/password access.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={() => setMode("login")}
            className={`rounded-full px-4 py-2 text-sm ${mode === "login" ? "bg-brand-forest text-white" : "border border-brand-forest/20 text-brand-forest"}`}
            data-testid="login-mode-login"
          >
            Login
          </button>
          <button
            onClick={() => setMode("register")}
            className={`rounded-full px-4 py-2 text-sm ${mode === "register" ? "bg-brand-forest text-white" : "border border-brand-forest/20 text-brand-forest"}`}
            data-testid="login-mode-register"
          >
            Register
          </button>
        </div>
        <button
          onClick={loginWithGoogle}
          className="mt-6 w-full rounded-full bg-brand-purple px-6 py-4 text-sm font-semibold text-white"
          data-testid="login-google-button"
        >
          Continue with Google
        </button>
        <form className="mt-6 grid gap-4 rounded-2xl bg-white/70 p-6 shadow-sm" onSubmit={submitForm}>
          {mode === "register" && (
            <input
              type="text"
              placeholder="Full name"
              className="h-12 rounded-lg border border-brand-forest/20 px-4"
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              data-testid="login-name-input"
            />
          )}
          <input
            type="email"
            placeholder="Email"
            className="h-12 rounded-lg border border-brand-forest/20 px-4"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            data-testid="login-email-input"
          />
          <input
            type="password"
            placeholder="Password"
            className="h-12 rounded-lg border border-brand-forest/20 px-4"
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
            data-testid="login-password-input"
          />
          {mode === "register" && (
            <select
              className="h-12 rounded-lg border border-brand-forest/20 px-4"
              value={form.role}
              onChange={(event) => setForm({ ...form, role: event.target.value })}
              data-testid="login-role-select"
            >
              <option value="Admin">Admin</option>
              <option value="Editor">Editor</option>
              <option value="Volunteer">Volunteer</option>
            </select>
          )}
          <button
            type="submit"
            className="rounded-full bg-brand-forest px-6 py-4 text-sm font-semibold text-white"
            data-testid="login-submit-button"
          >
            {mode === "login" ? "Sign in" : "Create account"}
          </button>
        </form>
      </section>
    </motion.div>
  );
};

export default Login;
