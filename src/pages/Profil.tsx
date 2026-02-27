import { useState } from "react";
import { User, Mail, Shield, Save, Camera } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import PageContainer from "@/components/PageContainer";

const Profil = () => {
  const [form, setForm] = useState({
    nom: "Ahmed Benali",
    email: "ahmed.b@elmazraa.dz",
    carteId: "EMP-001",
    role: "Admin",
    telephone: "0551234567",
    departement: "Système d'information",
  });
  const [passwordForm, setPasswordForm] = useState({ current: "", nouveau: "", confirmer: "" });

  const handleSave = () => toast.success("Profil mis à jour avec succès");
  const handlePasswordChange = () => {
    if (passwordForm.nouveau !== passwordForm.confirmer) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }
    toast.success("Mot de passe modifié avec succès");
    setPasswordForm({ current: "", nouveau: "", confirmer: "" });
  };

  return (
    <PageContainer title="Mon Profil" subtitle="Gérer vos informations personnelles">
      <div className="max-w-2xl space-y-6">
        {/* Avatar & info */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="section-card p-6">
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl font-heading">
                AB
              </div>
              <button className="absolute bottom-0 right-0 p-1.5 rounded-full bg-primary text-primary-foreground border-2 border-card">
                <Camera size={12} />
              </button>
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">{form.nom}</h3>
              <p className="text-sm text-muted-foreground">{form.email}</p>
              <div className="flex items-center gap-1.5 mt-1">
                <Shield size={14} className="text-primary" />
                <span className="text-xs font-medium text-primary">{form.role}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Personal info */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="section-card p-6">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <User size={18} className="text-primary" /> Informations personnelles
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { key: "nom", label: "Nom complet", icon: User },
              { key: "email", label: "Email", icon: Mail },
              { key: "carteId", label: "Carte ID", disabled: true },
              { key: "telephone", label: "Téléphone" },
              { key: "departement", label: "Département" },
              { key: "role", label: "Rôle", disabled: true },
            ].map(({ key, label, disabled }) => (
              <div key={key} className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">{label}</label>
                <input
                  value={form[key as keyof typeof form]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  disabled={disabled}
                  className={`input-field ${disabled ? "opacity-60 cursor-not-allowed bg-muted" : ""}`}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-end mt-5">
            <button onClick={handleSave} className="btn-primary"><Save size={16} /> Enregistrer</button>
          </div>
        </motion.div>

        {/* Change password */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="section-card p-6">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Shield size={18} className="text-primary" /> Changer le mot de passe
          </h3>
          <div className="space-y-4 max-w-sm">
            {[
              { key: "current", label: "Mot de passe actuel" },
              { key: "nouveau", label: "Nouveau mot de passe" },
              { key: "confirmer", label: "Confirmer le mot de passe" },
            ].map(({ key, label }) => (
              <div key={key} className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">{label}</label>
                <input
                  type="password"
                  value={passwordForm[key as keyof typeof passwordForm]}
                  onChange={(e) => setPasswordForm({ ...passwordForm, [key]: e.target.value })}
                  className="input-field"
                />
              </div>
            ))}
          </div>
          <div className="flex justify-end mt-5">
            <button onClick={handlePasswordChange} className="btn-primary"><Save size={16} /> Modifier</button>
          </div>
        </motion.div>
      </div>
    </PageContainer>
  );
};

export default Profil;
