import { useState } from "react";
import { Plus, Pencil, ShieldAlert, CheckCircle, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import PageContainer from "@/components/PageContainer";
import SearchBar from "@/components/SearchBar";
import EmptyState from "@/components/EmptyState";

const ALL_PERMISSIONS = [
  { key: "dashboard", label: "Accès Tableau de bord" },
  { key: "archives", label: "Accès Archives" },
  { key: "typesArchive", label: "Accès Types d'archive" },
  { key: "emplacements", label: "Accès Emplacements" },
  { key: "zones", label: "Accès Zones" },
  { key: "historique", label: "Accès Historique" },
  { key: "utilisateurs", label: "Accès Utilisateurs" },
  { key: "roles", label: "Accès Rôles utilisateurs" },
] as const;

type PermKey = (typeof ALL_PERMISSIONS)[number]["key"];
type Perms = Record<PermKey, boolean>;

const allTrue = (): Perms => Object.fromEntries(ALL_PERMISSIONS.map((p) => [p.key, true])) as Perms;
const allFalse = (): Perms => Object.fromEntries(ALL_PERMISSIONS.map((p) => [p.key, false])) as Perms;

interface Role {
  id: number;
  nom: string;
  description: string;
  perms: Perms;
}

const initial: Role[] = [
  { id: 1, nom: "Admin", description: "Accès complet à toutes les fonctionnalités.", perms: allTrue() },
  { id: 2, nom: "Agent", description: "Accès aux fonctionnalités métier.", perms: { ...allFalse(), dashboard: true, archives: true, typesArchive: true, emplacements: true, zones: true, historique: true } },
  { id: 3, nom: "Archiviste", description: "Accès réservé exclusivement aux archives.", perms: { ...allFalse(), dashboard: true, archives: true, typesArchive: true, emplacements: true, zones: true } },
  { id: 4, nom: "Consultant", description: "Accès en lecture seule à l'historique.", perms: { ...allFalse(), dashboard: true, historique: true } },
];

const Roles = () => {
  const [data, setData] = useState<Role[]>(initial);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Role | null>(null);
  const [form, setForm] = useState<Role>({ id: 0, nom: "", description: "", perms: allFalse() });
  const [error, setError] = useState("");

  const filtered = data.filter((r) => r.nom.toLowerCase().includes(search.toLowerCase()) || r.description.toLowerCase().includes(search.toLowerCase()));

  const openAdd = () => { setError(""); setEditing(null); setForm({ id: 0, nom: "", description: "", perms: allFalse() }); setDialogOpen(true); };
  const openEdit = (r: Role) => { setError(""); setEditing(r); setForm({ ...r, perms: { ...r.perms } }); setDialogOpen(true); };

  const togglePerm = (key: PermKey) => setForm((f) => ({ ...f, perms: { ...f.perms, [key]: !f.perms[key] } }));

  const handleSave = () => {
    if (!form.nom.trim()) { setError("Veuillez saisir un nom pour le rôle."); return; }
    if (editing) {
      setData((p) => p.map((r) => r.id === editing.id ? { ...form, id: editing.id } : r));
    } else {
      setData((p) => [...p, { ...form, id: Math.max(...p.map((r) => r.id), 0) + 1 }]);
    }
    setDialogOpen(false);
  };

  const permCount = (perms: Perms) => ALL_PERMISSIONS.filter((p) => perms[p.key]).length;

  return (
    <PageContainer title="Rôles utilisateurs" subtitle={`${data.length} rôles configurés`} actions={<button onClick={openAdd} className="btn-primary"><Plus size={18} /> Ajouter</button>}>
      <SearchBar value={search} onChange={setSearch} placeholder="Rechercher par rôle ou description..." />

      <div className="section-card mt-5">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/40">
                <th className="table-header">Rôle</th>
                {ALL_PERMISSIONS.map((p) => (
                  <th key={p.key} className="table-header text-center text-[11px]">{p.label.replace("Accès ", "")}</th>
                ))}
                <th className="table-header min-w-[180px]">Description</th>
                <th className="table-header text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filtered.map((r) => (
                  <motion.tr key={r.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="border-t border-border hover:bg-muted/20 transition-colors">
                    <td className="table-cell">
                      <div className="flex items-center gap-1.5">
                        <ShieldAlert size={16} className="text-muted-foreground" />
                        <span className="font-semibold text-foreground text-sm">{r.nom}</span>
                        <span className="text-[10px] text-muted-foreground ml-1">({permCount(r.perms)}/{ALL_PERMISSIONS.length})</span>
                      </div>
                    </td>
                    {ALL_PERMISSIONS.map((p) => (
                      <td key={p.key} className="table-cell text-center">
                        {r.perms[p.key] ? <CheckCircle size={15} className="text-success mx-auto" /> : <XCircle size={15} className="text-muted-foreground/30 mx-auto" />}
                      </td>
                    ))}
                    <td className="table-cell text-xs text-muted-foreground leading-relaxed">{r.description}</td>
                    <td className="table-cell text-right">
                      <button onClick={() => openEdit(r)} className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"><Pencil size={16} /></button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          {filtered.length === 0 && <EmptyState />}
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>{editing ? "Modifier le rôle" : "Nouveau rôle"}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            {error && <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium">{error}</div>}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Nom du rôle</label>
              <input type="text" value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} className="input-field" placeholder="ex: Analyste..." />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Description</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field min-h-[80px]" placeholder="Détails sur ce rôle..." />
            </div>
            <div className="space-y-3 pt-2">
              <label className="text-sm font-semibold text-foreground">Permissions (Droits d'accès)</label>
              {ALL_PERMISSIONS.map((p) => (
                <label key={p.key} className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/20 cursor-pointer hover:bg-muted/40 transition-colors">
                  <span className="text-sm font-medium">{p.label}</span>
                  <input type="checkbox" checked={form.perms[p.key]} onChange={() => togglePerm(p.key)} className="w-4 h-4 rounded text-primary border-muted-foreground/30 focus:ring-primary/30" />
                </label>
              ))}
            </div>
          </div>
          <DialogFooter className="flex w-full gap-3 sm:space-x-0">
            <button onClick={() => setDialogOpen(false)} className="btn-secondary flex-1 m-0">Annuler</button>
            <button onClick={handleSave} className="btn-primary flex-1 m-0">{editing ? "Enregistrer" : "Créer"}</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
};

export default Roles;
