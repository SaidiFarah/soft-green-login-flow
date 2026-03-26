import { useState } from "react";
import { Plus, Pencil, Shield, UserCheck, Eye as EyeIcon, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

import PageContainer from "@/components/PageContainer";
import SearchBar from "@/components/SearchBar";
import StatusBadge from "@/components/StatusBadge";
import EmptyState from "@/components/EmptyState";

interface User {
  id: number;
  nom: string;
  email: string;
  carteId: string;
  role: "Admin" | "Agent" | "Consultant" | "Archiviste";
  statut: "Actif" | "Inactif";
  dernierAcces: string;
}

const initial: User[] = [
  { id: 1, nom: "Ahmed Benali", email: "ahmed.b@elmazraa.dz", carteId: "EMP-001", role: "Admin", statut: "Actif", dernierAcces: "26/02/2026 09:15" },
  { id: 2, nom: "Fatima Zahra", email: "fatima.z@elmazraa.dz", carteId: "EMP-002", role: "Agent", statut: "Actif", dernierAcces: "26/02/2026 08:30" },
  { id: 3, nom: "Karim Mourad", email: "karim.m@elmazraa.dz", carteId: "EMP-003", role: "Agent", statut: "Actif", dernierAcces: "25/02/2026 16:45" },
  { id: 4, nom: "Sara Boudiaf", email: "sara.b@elmazraa.dz", carteId: "EMP-004", role: "Consultant", statut: "Actif", dernierAcces: "24/02/2026 10:00" },
  { id: 5, nom: "Youcef Djaballah", email: "youcef.d@elmazraa.dz", carteId: "EMP-005", role: "Consultant", statut: "Inactif", dernierAcces: "15/01/2026 14:20" },
];

const roleIcons = { Admin: Shield, Agent: UserCheck, Consultant: EyeIcon, Archiviste: Shield };
const roleColors = { Admin: "danger" as const, Agent: "info" as const, Consultant: "neutral" as const, Archiviste: "warning" as const };

const Utilisateurs = () => {
  const [data, setData] = useState(initial);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const [editing, setEditing] = useState<User | null>(null);
  
  const [form, setForm] = useState({ nom: "", email: "", motDePasse: "", confirmMotDePasse: "", carteId: "", role: "Agent" as User["role"], statut: "Actif" as User["statut"] });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const filtered = data.filter((u) => u.nom.toLowerCase().includes(search.toLowerCase()) || u.carteId.toLowerCase().includes(search.toLowerCase()));

  const openAdd = () => { setError(""); setEditing(null); setForm({ nom: "", email: "", motDePasse: "", confirmMotDePasse: "", carteId: "", role: "Agent", statut: "Actif" }); setDialogOpen(true); };
  const openEdit = (u: User) => { setError(""); setEditing(u); setForm({ nom: u.nom, email: u.email, motDePasse: "", confirmMotDePasse: "", carteId: u.carteId, role: u.role, statut: u.statut }); setDialogOpen(true); };

  const handleSave = () => {
    setError("");
    if (!form.nom || !form.carteId) {
      setError("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    if (!/^[a-zA-ZÀ-ÿ\s'-]+$/.test(form.nom)) {
      setError("Le nom complet ne doit contenir que des lettres.");
      return;
    }

    if (!/^\d{8}$/.test(form.carteId)) {
      setError("La Carte ID doit contenir exactement 8 chiffres.");
      return;
    }

    if (!editing || form.motDePasse) {
      const password = form.motDePasse;
      if (password !== form.confirmMotDePasse) {
        setError("Les mots de passe ne correspondent pas.");
        return;
      }
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
    }

    if (editing) {
      setData((p) => p.map((u) => u.id === editing.id ? { ...u, nom: form.nom, carteId: form.carteId, statut: form.statut, role: form.role, dernierAcces: u.dernierAcces } : u));
    } else {
      setData((p) => [...p, { id: Math.max(...p.map((u) => u.id), 0) + 1, nom: form.nom, email: form.nom.toLowerCase().replace(" ", ".") + "@elmazraa.dz", carteId: form.carteId, role: form.role, statut: "Actif", dernierAcces: "—" }]);
    }
    setDialogOpen(false);
  };

  

  return (
    <PageContainer title="Utilisateurs & Rôles" subtitle={`${data.length} utilisateurs enregistrés`} actions={<button onClick={openAdd} className="btn-primary"><Plus size={18} /> Ajouter</button>}>
      <SearchBar value={search} onChange={setSearch} placeholder="Rechercher par nom ou carte ID..." />

      <div className="section-card mt-5">
        <div className="overflow-x-auto">
          <table className="w-full">
                <thead><tr className="bg-muted/40">
                  <th className="table-header">Utilisateur</th>
                  <th className="table-header">Carte ID</th>
                  <th className="table-header">Rôle</th>
                  <th className="table-header">Statut</th>
                  <th className="table-header">Dernier accès</th>
                  <th className="table-header text-right">Actions</th>
                </tr></thead>
                <tbody>
                  <AnimatePresence>
                    {filtered.map((u) => {
                      const RoleIcon = roleIcons[u.role];
                      return (
                        <motion.tr key={u.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="border-t border-border hover:bg-muted/20 transition-colors">
                          <td className="table-cell">
                            <p className="font-medium text-foreground">{u.nom}</p>
                          </td>
                          <td className="table-cell font-mono text-primary font-medium">{u.carteId}</td>
                          <td className="table-cell">
                            <div className="flex items-center gap-1.5">
                              <RoleIcon size={14} className="text-muted-foreground" />
                              <StatusBadge status={u.role} variant={roleColors[u.role]} />
                            </div>
                          </td>
                          <td className="table-cell"><StatusBadge status={u.statut} variant={u.statut === "Actif" ? "success" : "neutral"} /></td>
                          <td className="table-cell text-xs text-muted-foreground">{u.dernierAcces}</td>
                          <td className="table-cell text-right">
                            <div className="flex justify-end gap-1">
                              <button onClick={() => openEdit(u)} className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"><Pencil size={16} /></button>
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                </tbody>
              </table>
              {filtered.length === 0 && <EmptyState />}
            </div>
          </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>{editing ? "Modifier l'utilisateur" : "Nouvel utilisateur"}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium">
                {error}
              </div>
            )}
            {[{ key: "nom", label: "Nom complet", type: "text" }, { key: "motDePasse", label: "Mot de passe", type: "password" }, { key: "confirmMotDePasse", label: "Confirmer mot de passe", type: "password" }, { key: "carteId", label: "Carte ID", type: "text" }].map(({ key, label, type }) => (
              <div key={key} className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">{label}</label>
                {type === "password" ? (
                  <div className="relative">
                    <input
                      type={key === "motDePasse" ? (showPassword ? "text" : "password") : (showConfirmPassword ? "text" : "password")}
                      value={(form as any)[key]}
                      onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                      className="input-field pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => key === "motDePasse" ? setShowPassword(!showPassword) : setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 rounded transition-colors"
                    >
                      {(key === "motDePasse" ? showPassword : showConfirmPassword) ? <EyeOff size={16} /> : <EyeIcon size={16} />}
                    </button>
                  </div>
                ) : (
                  <input
                    type={type}
                    value={(form as any)[key]}
                    onChange={(e) => setForm({
                      ...form,
                      [key]: key === "carteId" ? e.target.value.replace(/\D/g, "") : e.target.value
                    })}
                    className="input-field"
                    maxLength={key === "carteId" ? 8 : undefined}
                  />
                )}
                {key === "motDePasse" && (
                  <p className="text-xs text-muted-foreground mt-1 leading-tight">
                    Le mot de passe doit comporter 10 caractères et contenir au moins 3 chiffres, 1 lettre majuscule, 1 lettre minuscule et 1 caractère spécial.
                  </p>
                )}
              </div>
            ))}
            {editing && (
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Statut</label>
                <select value={form.statut} onChange={(e) => setForm({ ...form, statut: e.target.value as User["statut"] })} className="input-field">
                  <option>Actif</option><option>Inactif</option>
                </select>
              </div>
            )}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Rôle</label>
              <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as User["role"] })} className="input-field">
                <option value="Admin">Admin</option>
                <option value="Agent">Agent</option>
                <option value="Consultant">Consultant</option>
                <option value="Archiviste">Archiviste</option>
              </select>
            </div>
          </div>
          <DialogFooter className="flex w-full gap-3 sm:space-x-0">
            <button onClick={() => setDialogOpen(false)} className="btn-secondary flex-1 m-0">Annuler</button>
            <button onClick={handleSave} className="btn-primary flex-1 m-0">{editing ? "Enregistrer" : "Ajouter"}</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </PageContainer>
  );
};

export default Utilisateurs;
