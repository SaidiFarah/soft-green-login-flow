import { useState } from "react";
import { Plus, Pencil, Trash2, Shield, UserCheck, Eye as EyeIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import PageContainer from "@/components/PageContainer";
import SearchBar from "@/components/SearchBar";
import StatusBadge from "@/components/StatusBadge";
import EmptyState from "@/components/EmptyState";

interface User {
  id: number;
  nom: string;
  email: string;
  carteId: string;
  role: "Admin" | "Agent" | "Consultation";
  statut: "Actif" | "Inactif";
  dernierAcces: string;
}

const initial: User[] = [
  { id: 1, nom: "Ahmed Benali", email: "ahmed.b@elmazraa.dz", carteId: "EMP-001", role: "Admin", statut: "Actif", dernierAcces: "26/02/2026 09:15" },
  { id: 2, nom: "Fatima Zahra", email: "fatima.z@elmazraa.dz", carteId: "EMP-002", role: "Agent", statut: "Actif", dernierAcces: "26/02/2026 08:30" },
  { id: 3, nom: "Karim Mourad", email: "karim.m@elmazraa.dz", carteId: "EMP-003", role: "Agent", statut: "Actif", dernierAcces: "25/02/2026 16:45" },
  { id: 4, nom: "Sara Boudiaf", email: "sara.b@elmazraa.dz", carteId: "EMP-004", role: "Consultation", statut: "Actif", dernierAcces: "24/02/2026 10:00" },
  { id: 5, nom: "Youcef Djaballah", email: "youcef.d@elmazraa.dz", carteId: "EMP-005", role: "Consultation", statut: "Inactif", dernierAcces: "15/01/2026 14:20" },
];

const roleIcons = { Admin: Shield, Agent: UserCheck, Consultation: EyeIcon };
const roleColors = { Admin: "danger" as const, Agent: "info" as const, Consultation: "neutral" as const };

const Utilisateurs = () => {
  const [data, setData] = useState(initial);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [form, setForm] = useState({ nom: "", email: "", carteId: "", role: "Agent" as User["role"], statut: "Actif" as User["statut"] });

  const filtered = data.filter((u) => u.nom.toLowerCase().includes(search.toLowerCase()) || u.carteId.toLowerCase().includes(search.toLowerCase()));

  const openAdd = () => { setEditing(null); setForm({ nom: "", email: "", carteId: "", role: "Agent", statut: "Actif" }); setDialogOpen(true); };
  const openEdit = (u: User) => { setEditing(u); setForm({ nom: u.nom, email: u.email, carteId: u.carteId, role: u.role, statut: u.statut }); setDialogOpen(true); };

  const handleSave = () => {
    if (!form.nom || !form.carteId) return;
    if (editing) {
      setData((p) => p.map((u) => u.id === editing.id ? { ...u, ...form, dernierAcces: u.dernierAcces } : u));
    } else {
      setData((p) => [...p, { id: Math.max(...p.map((u) => u.id), 0) + 1, ...form, dernierAcces: "—" }]);
    }
    setDialogOpen(false);
  };

  const confirmDelete = () => { if (deletingId !== null) { setData((p) => p.filter((u) => u.id !== deletingId)); setDeletingId(null); setDeleteOpen(false); } };

  return (
    <PageContainer title="Utilisateurs & Rôles" subtitle={`${data.length} utilisateurs enregistrés`} actions={<button onClick={openAdd} className="btn-primary"><Plus size={18} /> Ajouter</button>}>
      <SearchBar value={search} onChange={setSearch} placeholder="Rechercher par nom ou carte ID..." />

      <div className="section-card">
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
                        <div>
                          <p className="font-medium text-foreground">{u.nom}</p>
                          <p className="text-xs text-muted-foreground">{u.email}</p>
                        </div>
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
                          <button onClick={() => { setDeletingId(u.id); setDeleteOpen(true); }} className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"><Trash2 size={16} /></button>
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
            {[{ key: "nom", label: "Nom complet" }, { key: "email", label: "Email" }, { key: "carteId", label: "Carte ID" }].map(({ key, label }) => (
              <div key={key} className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">{label}</label>
                <input value={form[key as keyof typeof form]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} className="input-field" />
              </div>
            ))}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Rôle</label>
                <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as User["role"] })} className="input-field">
                  <option>Admin</option><option>Agent</option><option>Consultation</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Statut</label>
                <select value={form.statut} onChange={(e) => setForm({ ...form, statut: e.target.value as User["statut"] })} className="input-field">
                  <option>Actif</option><option>Inactif</option>
                </select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <button onClick={() => setDialogOpen(false)} className="btn-secondary">Annuler</button>
            <button onClick={handleSave} className="btn-primary">{editing ? "Enregistrer" : "Ajouter"}</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Supprimer cet utilisateur ?</AlertDialogTitle>
            <AlertDialogDescription>Cette action est irréversible.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Annuler</AlertDialogCancel><AlertDialogAction onClick={confirmDelete} className="btn-danger">Supprimer</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageContainer>
  );
};

export default Utilisateurs;
