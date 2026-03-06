import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/logo.jpg";
import { Eye, EyeOff, LogIn, ShieldCheck, Lock } from "lucide-react";
import { motion } from "framer-motion";

const Index = () => {
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!code || !password) {
      setError("Veuillez remplir tous les champs.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate("/dashboard");
    }, 1000);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
    const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
    setMousePos({ x, y });
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-background px-4 relative overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Animated background orbs */}
      <motion.div
        animate={{
          x: mousePos.x * 30,
          y: mousePos.y * 30,
        }}
        transition={{ type: "spring", stiffness: 50, damping: 20 }}
        className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full bg-primary/[0.06] blur-3xl"
      />
      <motion.div
        animate={{
          x: mousePos.x * -20,
          y: mousePos.y * -20,
        }}
        transition={{ type: "spring", stiffness: 50, damping: 20 }}
        className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full bg-accent/[0.05] blur-3xl"
      />
      <motion.div
        animate={{
          x: mousePos.x * 15,
          y: mousePos.y * -15,
        }}
        transition={{ type: "spring", stiffness: 50, damping: 20 }}
        className="absolute top-1/3 left-1/4 w-[300px] h-[300px] rounded-full bg-info/[0.04] blur-3xl"
      />

      {/* Floating grid dots */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: "radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 1px)",
        backgroundSize: "32px 32px",
      }} />

      <div className="w-full max-w-[480px] relative z-10">
        {/* 3D Card with perspective */}
        <motion.div
          initial={{ opacity: 0, y: 40, rotateX: 10 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{
            perspective: "1200px",
          }}
        >
          <motion.div
            animate={{
              rotateY: mousePos.x * 4,
              rotateX: mousePos.y * -4,
            }}
            transition={{ type: "spring", stiffness: 100, damping: 30 }}
            className="relative"
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Glow behind card */}
            <motion.div
              animate={{
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-primary/20 via-transparent to-accent/20 blur-xl"
            />

            {/* Main card */}
            <div className="relative section-card rounded-2xl p-10 backdrop-blur-sm border border-border/60 shadow-2xl">
              {/* Decorative corner accents */}
              <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-primary/20 rounded-tl-2xl" />
              <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-primary/20 rounded-br-2xl" />

              {/* Logo inside card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
                className="flex justify-center mb-6"
              >
                <div className="relative">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -inset-3 rounded-full border border-dashed border-primary/15"
                  />
                  <div className="relative h-20 w-20 rounded-2xl overflow-hidden ring-2 ring-primary/10 ring-offset-2 ring-offset-card shadow-lg">
                    <img src={logo} alt="El Mazraa" className="h-full w-full object-cover" />
                  </div>
                </div>
              </motion.div>

              {/* Title */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-center mb-8"
              >
                <div className="flex items-center justify-center gap-2 mb-2">
                  <ShieldCheck size={20} className="text-primary" />
                  <h1 className="text-xl font-bold text-foreground font-heading">
                    Gestion des Archives
                  </h1>
                </div>
                <p className="text-muted-foreground text-sm">
                  Connectez-vous avec votre carte ID
                </p>
              </motion.div>

              {/* Error */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mb-5 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium"
                >
                  {error}
                </motion.div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <motion.div
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 }}
                  className="space-y-2"
                >
                  <label htmlFor="code" className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                    <ShieldCheck size={14} className="text-primary/70" />
                    Carte ID
                  </label>
                  <input
                    id="code"
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Entrez votre code identifiant"
                    className="input-field h-12 text-base"
                    required
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.45 }}
                  className="space-y-2"
                >
                  <label htmlFor="password" className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                    <Lock size={14} className="text-primary/70" />
                    Mot de passe
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Entrez votre mot de passe"
                      className="input-field h-12 pr-12 text-base"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md hover:bg-muted"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </motion.div>

                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55 }}
                  whileHover={{ scale: 1.02, boxShadow: "0 8px 30px -8px hsl(152 55% 32% / 0.4)" }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full h-12 text-base mt-3 rounded-xl"
                >
                  {loading ? (
                    <div className="h-5 w-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  ) : (
                    <>
                      <LogIn size={20} />
                      Se connecter
                    </>
                  )}
                </motion.button>
              </form>

              {/* Security badge */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="mt-6 flex items-center justify-center gap-1.5 text-muted-foreground"
              >
                <Lock size={12} />
                <span className="text-xs">Connexion sécurisée · Accès autorisé uniquement</span>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center text-muted-foreground text-xs mt-8"
        >
          © 2026 El Mazraa — Gestion des Archives v1.0
        </motion.p>
      </div>
    </div>
  );
};

export default Index;
