import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/logo.jpg";
import { Eye, EyeOff, LogIn, ShieldCheck, Lock, UserPlus } from "lucide-react";
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

    // Validation Carte ID : exactement 8 chiffres
    if (code.length !== 8) {
      setError("La Carte ID doit contenir exactement 8 chiffres.");
      return;
    }

    // Validation Mot de passe
    if (password.length < 10) {
      setError("Le mot de passe doit contenir au moins 10 caractères.");
      return;
    }

    const numberCount = (password.match(/\d/g) || []).length;
    if (numberCount < 3) {
      setError("Le mot de passe doit contenir au moins 3 chiffres.");
      return;
    }

    if (!/[A-Z]/.test(password) || !/[a-z]/.test(password)) {
      setError("Le mot de passe doit contenir au moins une lettre majuscule et une lettre minuscule.");
      return;
    }

    if (!/[^A-Za-z0-9]/.test(password)) {
      setError("Le mot de passe doit contenir au moins un caractère spécial.");
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
      {/* Professional 3D Animated Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ perspective: "1200px" }}>
        {/* Animated 3D Rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full flex items-center justify-center opacity-40">
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={`ring-${i}`}
              animate={{
                rotateX: [60, 60],
                rotateZ: [0, 360],
                z: [-200, 50, -200],
              }}
              transition={{
                rotateZ: { duration: 40 + i * 15, repeat: Infinity, ease: "linear" },
                z: { duration: 10, repeat: Infinity, ease: "easeInOut", delay: i * 2 },
              }}
              className={`absolute rounded-full border ${i % 2 === 0 ? 'border-primary/30 border-dashed' : 'border-accent/30'}`}
              style={{
                width: `${500 + i * 250}px`,
                height: `${500 + i * 250}px`,
                transformStyle: "preserve-3d",
              }}
            />
          ))}
        </div>

        {/* 3D Floating Glass Documents */}
        {[
          { left: "12%", top: "15%", delay: 0, rotateY: 25, rotateZ: -15, z: -150 },
          { left: "78%", top: "20%", delay: 1, rotateY: -20, rotateZ: 10, z: -250 },
          { left: "70%", top: "65%", delay: 2, rotateY: -35, rotateZ: -5, z: -100 },
          { left: "15%", top: "60%", delay: 1.5, rotateY: 35, rotateZ: 20, z: -200 },
        ].map((doc, i) => (
          <motion.div
            key={`doc-${i}`}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: [-15, 15, -15],
              rotateX: mousePos.y * -30 + 10,
              rotateY: mousePos.x * 30 + doc.rotateY,
              rotateZ: doc.rotateZ,
            }}
            transition={{
              opacity: { duration: 1, delay: 0.5 + i * 0.2 },
              scale: { duration: 1, ease: "easeOut", delay: 0.5 + i * 0.2 },
              y: { duration: 6 + i, repeat: Infinity, ease: "easeInOut", delay: doc.delay },
              rotateX: { type: "spring", stiffness: 40, damping: 20 },
              rotateY: { type: "spring", stiffness: 40, damping: 20 },
            }}
            className="absolute w-44 h-56 md:w-56 md:h-72 rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-white/0 backdrop-blur-md shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] flex flex-col gap-3 p-4 md:p-6"
            style={{
              left: doc.left,
              top: doc.top,
              transform: `translateZ(${doc.z}px)`,
              transformStyle: "preserve-3d",
            }}
          >
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-primary/30 mb-2 md:mb-4 border border-primary/20 flex items-center justify-center shadow-inner" style={{ transform: "translateZ(20px)" }}>
              <div className="w-1/2 h-1/2 bg-primary/50 text-white rounded-sm" />
            </div>
            <div className="h-2 w-full rounded-full bg-foreground/10" style={{ transform: "translateZ(10px)" }} />
            <div className="h-2 w-3/4 rounded-full bg-foreground/10" style={{ transform: "translateZ(15px)" }} />
            <div className="h-2 w-1/2 rounded-full bg-foreground/5" style={{ transform: "translateZ(10px)" }} />
            <div className="mt-auto h-2 w-full rounded-full bg-foreground/5" />
            <div className="h-2 w-full rounded-full bg-foreground/5" />
            
            {/* 3D Inner floating element */}
            <motion.div
              animate={{ z: [30, 50, 30] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: i }}
              className="absolute -right-4 -bottom-4 w-16 h-16 md:w-20 md:h-20 rounded-xl bg-accent/20 border border-white/20 backdrop-blur-xl shadow-xl flex items-center justify-center"
              style={{ transformStyle: "preserve-3d" }}
            >
              <div className="w-8 h-8 rounded-full border-2 border-accent/50 border-t-accent" style={{ transform: "translateZ(15px)" }} />
            </motion.div>
          </motion.div>
        ))}

        {/* Dynamic Light Orbs with 3D depth */}
        <motion.div
          animate={{ x: mousePos.x * 50, y: mousePos.y * 50 }}
          transition={{ type: "spring", stiffness: 40, damping: 20 }}
          className="absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-primary/10 blur-[120px]"
          style={{ transform: "translateZ(-300px)" }}
        />
        <motion.div
          animate={{ x: mousePos.x * -50, y: mousePos.y * -50 }}
          transition={{ type: "spring", stiffness: 40, damping: 20 }}
          className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-accent/10 blur-[120px]"
          style={{ transform: "translateZ(-300px)" }}
        />
      </div>

      {/* Floating grid dots */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: "radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 1px)",
        backgroundSize: "32px 32px",
        transform: "translateZ(-400px)"
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
            <div className="relative section-card rounded-2xl p-10 backdrop-blur-md border border-border/60 shadow-2xl" style={{ transformStyle: "preserve-3d" }}>
              {/* Decorative corner accents */}
              <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-primary/20 rounded-tl-2xl" style={{ transform: "translateZ(10px)" }} />
              <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-primary/20 rounded-br-2xl" style={{ transform: "translateZ(10px)" }} />

              {/* Logo inside card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
                className="flex justify-center mb-6"
                style={{ transform: "translateZ(40px)" }}
              >
                <div className="relative group">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -inset-3 rounded-full border border-dashed border-primary/30 group-hover:border-primary/60 transition-colors"
                  />
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                    className="absolute -inset-5 rounded-full border border-solid border-accent/10"
                    style={{ transform: "translateZ(-10px)" }}
                  />
                  <div className="relative h-20 w-20 rounded-2xl overflow-hidden ring-2 ring-primary/20 ring-offset-2 ring-offset-card shadow-2xl shadow-primary/20">
                    <img src={logo} alt="Mazeraa Archive" className="h-full w-full object-cover" />
                  </div>
                </div>
              </motion.div>

              {/* Title */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-center mb-8"
                style={{ transform: "translateZ(30px)" }}
              >
                <div className="flex items-center justify-center gap-2 mb-2">
                  <ShieldCheck size={20} className="text-primary" />
                  <h1 className="text-2xl font-bold bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent font-heading">
                    Mazeraa Archive
                  </h1>
                </div>
                <p className="text-muted-foreground text-sm font-medium">
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
              <form onSubmit={handleSubmit} className="space-y-5" style={{ transform: "translateZ(20px)" }}>
                <motion.div
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 }}
                  className="space-y-2 relative"
                >
                  <label htmlFor="code" className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                    <ShieldCheck size={14} className="text-primary/70" />
                    Carte ID
                  </label>
                  <input
                    id="code"
                    type="text"
                    value={code}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "");
                      if (val.length <= 8) setCode(val);
                    }}
                    placeholder="Entrez votre code identifiant"
                    className="input-field h-12 text-base shadow-inner bg-background/50 focus:bg-background transition-colors"
                    maxLength={8}
                    required
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.45 }}
                  className="space-y-2 relative"
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
                      className="input-field h-12 pr-12 text-base shadow-inner bg-background/50 focus:bg-background transition-colors"
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
                  whileHover={{ scale: 1.03, boxShadow: "0 10px 40px -10px hsl(var(--primary) / 0.5)", translateZ: "10px" }}
                  whileTap={{ scale: 0.97, translateZ: "0px" }}
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full h-12 text-base mt-4 rounded-xl relative overflow-hidden group"
                >
                  {/* Button shine effect */}
                  <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
                  
                  {loading ? (
                    <div className="relative z-10 h-5 w-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  ) : (
                    <div className="relative z-10 flex items-center gap-2">
                      <LogIn size={20} />
                      Se connecter
                    </div>
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
          © 2026 Mazeraa Archive v1.0
        </motion.p>
      </div>
    </div>
  );
};

export default Index;
