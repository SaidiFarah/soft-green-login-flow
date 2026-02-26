import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/logo.jpg";
import { Eye, EyeOff, LogIn } from "lucide-react";

const Index = () => {
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate("/dashboard");
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-accent/5 blur-3xl" />

      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8 opacity-0 animate-scale-in">
          <div className="animate-float">
            <img src={logo} alt="El Mazraa" className="h-28 w-auto drop-shadow-lg" />
          </div>
        </div>

        {/* Card */}
        <div className="bg-card rounded-2xl login-card-shadow p-8 opacity-0 animate-fade-in-delay">
          <h2 className="text-2xl font-bold text-center text-foreground mb-1">
            مرحباً بك
          </h2>
          <p className="text-center text-muted-foreground mb-8 text-sm">
            قم بتسجيل الدخول للمتابعة
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Code ID */}
            <div className="space-y-2 opacity-0 animate-fade-in-delay">
              <label htmlFor="code" className="text-sm font-semibold text-foreground">
                Code ID
              </label>
              <input
                id="code"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Entrez votre code"
                className="w-full h-12 px-4 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/40 focus:border-primary transition-all duration-200"
                required
              />
            </div>

            {/* Password */}
            <div className="space-y-2 opacity-0 animate-fade-in-delay-2">
              <label htmlFor="password" className="text-sm font-semibold text-foreground">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Entrez votre mot de passe"
                  className="w-full h-12 px-4 pr-12 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/40 focus:border-primary transition-all duration-200"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-lg bg-primary text-primary-foreground font-bold text-base flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.98] transition-all duration-200 disabled:opacity-60 mt-2"
            >
              {loading ? (
                <div className="h-5 w-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn size={20} />
                  Se connecter
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-muted-foreground text-xs mt-6 opacity-0 animate-fade-in-delay-2">
          © 2026 El Mazraa — Tous droits réservés
        </p>
      </div>
    </div>
  );
};

export default Index;
