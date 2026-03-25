import { useState } from "react";
import { Plus, Pencil, Trash2, CheckCircle, XCircle, ShieldAlert } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import PageContainer from "@/components/PageContainer";
import SearchBar from "@/components/SearchBar";
import EmptyState from "@/components/EmptyState";

interface Role {
  id: number;
  nom: string;
  perms: {
    utilisateurs: boolean;
    archivesZones: boolean;
    historique: boolean;
  };
  description: string;
}

const initial: Role[] = [
  { id: 1, nom: "Admin", perms: { utilisateurs: true, archivesZones: true, historique: true }, description: "Accès complet à toutes les fonctionnalités." },
  { id: 2, nom: "Agent", perms: { utilisateurs: false, archivesZones: true, historique: true }, description: "Accès aux fonctionnalités métier." },
  { id: 3, nom: "Archiviste", perms: { utilisateurs: false, archivesZones: true, historique: false }, description: "Accès réservé exclusivement aux archives." },
  { id: 4, nom: "Consultant", perms: { utilisateurs: false, archivesZones: false, historique: true }, description: "Accès en lecture seule à l'historique." },
];

const Roles = () => {
  const [data, setData] = useState<Role[]>(initial);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editing, setEditing] = useState<Role | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [form, setForm] = useState<Role>({ id: 0, nom: "", perms: { utilisateurs: false, archivesZones: false, historique: false }, description: "" });
  const [error, setError] = useState("");

  const filtered = data.filter((r) => r.nom.toLowerCase().includes(search.toLowerCase()) || r.description.toLowerCase().includes(search.toLowerCase()));

  const openAdd = () => { setError(""); setEditing(null); setForm({ id: 0, nom: "", perms: { utilisateurs: false, archivesZones: false, historique: false }, description: "" }); setDialogOpen(true); };
  const openEdit = (r: Role) => { setError(""); setEditing(r); setForm({ ...r }); setDialogOpen(true); };

  const handleSave = () => {
    setError("");
    if (!form.nom) {
      setError("Veuillez saisir un nom pour le rôle.");
      return;
    }

    if (editing) {
      setData((p) => p.map((r) => r.id === editing.id ? { ...form, id: editing.id } : r));
    } else {
      setData((p) => [...p, { ...form, id: Math.max(...p.map((r) => r.id), 0) + 1 }]);
    }
    setDialogOpen(false);
  };

  const confirmDelete = () => {
    if (deletingId !== null) {
      setData((p) => p.filter((r) => r.id !== deletingId));
      setDeletingId(null);
      setDeleteOpen(false);
    }
  };

  return (
    <PageContainer title="Table des rôles" subtitle={`${data.length} rôles configurés`} actions={<button onClick={openAdd} className="btn-primary"><Plus size={18} /> Ajouter</button>}>
      <SearchBar value={search} onChange={setSearch} placeholder="Rechercher par rôle ou description..." />

      <div className="section-card mt-5">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/40">
                <th className="table-header">Rôle</th>
                <th className="table-header text-center">Accès Utilisateurs</th>
                <th className="table-header text-center">Accès Archives & Zones</th>
                <th className="table-header text-center">Accès Historique</th>
                <th className="table-header min-w-[200px]">Description</th>
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
                      </div>
                    </td>
                    <td className="table-cell text-center">
                      {r.perms.utilisateurs ? <CheckCircle size={16} className="text-success mx-auto"/> : <XCircle size={16} className="text-muted-foreground/40 mx-auto"/>}
                    </td>
                    <td className="table-cell text-center">
                      {r.perms.archivesZones ? <CheckCircle size={16} className="text-success mx-auto"/> : <XCircle size={16} className="text-muted-foreground/40 mx-auto"/>}
                    </td>
                    <td className="table-cell text-center">
                      {r.perms.historique ? <CheckCircle size={16} className="text-success mx-auto"/> : <XCircle size={16} className="text-muted-foreground/40 mx-auto"/>}
                    </td>
                    <td className="table-cell text-xs text-muted-foreground leading-relaxed">
                      {r.description}
                    </td>
                    <td className="table-cell text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(r)} className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"><Pencil size={16} /></button>
                      </div>
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
            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium">
                {error}
              </div>
            )}
            
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
              
              <label className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/20 cursor-pointer hover:bg-muted/40 transition-colors">
                <span className="text-sm font-medium">Accès Gestion Utilisateurs</span>
                <input type="checkbox" checked={form.perms.utilisateurs} onChange={(e) => setForm({ ...form, perms: { ...form.perms, utilisateurs: e.target.checked } })} className="w-4 h-4 rounded text-primary border-muted-foreground/30 focus:ring-primary/30" />
              </label>
              
              <label className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/20 cursor-pointer hover:bg-muted/40 transition-colors">
                <span className="text-sm font-medium">Accès Archives & Zones</span>
                <input type="checkbox" checked={form.perms.archivesZones} onChange={(e) => setForm({ ...form, perms: { ...form.perms, archivesZones: e.target.checked } })} className="w-4 h-4 rounded text-primary border-muted-foreground/30 focus:ring-primary/30" />
              </label>

              <label className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/20 cursor-pointer hover:bg-muted/40 transition-colors">
                <span className="text-sm font-medium">Accès Historique</span>
                <input type="checkbox" checked={form.perms.historique} onChange={(e) => setForm({ ...form, perms: { ...form.perms, historique: e.target.checked } })} className="w-4 h-4 rounded text-primary border-muted-foreground/30 focus:ring-primary/30" />
              </label>
            </div>
          </div>
          <DialogFooter className="flex w-full gap-3 sm:space-x-0">
            <button onClick={() => setDialogOpen(false)} className="btn-secondary flex-1 m-0">Annuler</button>
            <button onClick={handleSave} className="btn-primary flex-1 m-0">{editing ? "Enregistrer" : "Créer"}</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Supprimer ce rôle ?</AlertDialogTitle>
            <AlertDialogDescription>Êtes-vous sûr de vouloir supprimer ce rôle ? Toute suppression est définitive et pourrait affecter les utilisateurs liés.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel className="mt-0">Annuler</AlertDialogCancel><AlertDialogAction onClick={confirmDelete} className="btn-danger m-0">Supprimer</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageContainer>
  );
};

export default Roles;
