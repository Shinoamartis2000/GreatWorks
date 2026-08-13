import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ShieldCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import PageHeader from "@/components/PageHeader";

const Login = () => {
  const { loginWithJWT, registerWithJWT, loginWithGoogle } = useAuth();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "Volunteer" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submitForm = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      if (mode === "login") {
        await loginWithJWT(form.email, form.password);
      } else {
        await registerWithJWT(form);
      }
      navigate("/admin");
    } catch (e) {
      const detail = e?.response?.data?.detail;
      toast.error(typeof detail === "string" ? detail : "Sign in failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const field = "h-12 w-full rounded-sm border border-gov-line px-4 text-sm text-gov-navy";

  return (
    <div>
      <PageHeader
        eyebrow="Staff Access"
        title="Staff & Administrator Login"
        description="Authorised staff can sign in to manage content, programmes, and publications."
        breadcrumbs={[{ label: "Login" }]}
        testId="login-header"
      />

      <section className="bg-white py-14 md:py-20" data-testid="login-page">
        <div className="gov-container max-w-xl">
          <div className="mb-4 flex items-center gap-2 rounded-sm border border-gov-line bg-gov-mist px-4 py-3 text-sm text-gov-charcoal">
            <ShieldCheck className="h-4 w-4 text-gov-green" aria-hidden="true" />
            This is a restricted area for authorised personnel.
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setMode("login")}
              className={`flex-1 rounded-sm px-4 py-2 text-sm font-semibold transition-colors duration-200 ${mode === "login" ? "bg-gov-navy text-white" : "border border-gov-line text-gov-charcoal hover:bg-gov-mist"}`}
              data-testid="login-mode-login"
            >
              Login
            </button>
            <button
              onClick={() => setMode("register")}
              className={`flex-1 rounded-sm px-4 py-2 text-sm font-semibold transition-colors duration-200 ${mode === "register" ? "bg-gov-navy text-white" : "border border-gov-line text-gov-charcoal hover:bg-gov-mist"}`}
              data-testid="login-mode-register"
            >
              Register
            </button>
          </div>

          <form className="mt-5 gov-card grid gap-4 p-6" onSubmit={submitForm}>
            {mode === "register" && (
              <div>
                <label htmlFor="l-name" className="text-sm font-semibold text-gov-navy">Full name</label>
                <input id="l-name" className={`mt-1 ${field}`} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} data-testid="login-name-input" />
              </div>
            )}
            <div>
              <label htmlFor="l-email" className="text-sm font-semibold text-gov-navy">Email</label>
              <input id="l-email" type="email" className={`mt-1 ${field}`} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} data-testid="login-email-input" />
            </div>
            <div>
              <label htmlFor="l-password" className="text-sm font-semibold text-gov-navy">Password</label>
              <input id="l-password" type="password" className={`mt-1 ${field}`} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} data-testid="login-password-input" />
            </div>
            {mode === "register" && (
              <div>
                <label htmlFor="l-role" className="text-sm font-semibold text-gov-navy">Role</label>
                <select id="l-role" className={`mt-1 ${field}`} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} data-testid="login-role-select">
                  <option value="Admin">Admin</option>
                  <option value="Editor">Editor</option>
                  <option value="Volunteer">Volunteer</option>
                </select>
              </div>
            )}
            <button type="submit" disabled={loading} className="gov-btn-primary w-full disabled:opacity-60" data-testid="login-submit-button">
              {loading ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}
            </button>
          </form>

          <button onClick={loginWithGoogle} className="mt-3 w-full gov-btn-secondary" data-testid="login-google-button">
            Continue with Google
          </button>
        </div>
      </section>
    </div>
  );
};

export default Login;
