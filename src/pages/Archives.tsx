import { useState } from "react";
import { Eye, Filter, Archive } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import PageContainer from "@/components/PageContainer";
import SearchBar from "@/components/SearchBar";
import StatusBadge from "@/components/StatusBadge";
import EmptyState from "@/components/EmptyState";

interface ArchiveItem {
  id: number;
  code: string;
  titre: string;
  description: string;
  emplacement: string;
  dateEntree: string;
  statut: string;
}

const initialData: ArchiveItem[] = [
  { id: 1, code: "ARC-2024-0142", titre: "Dossier RH - Recrutement Q1", description: "Ressources Humaines", emplacement: "Zone A1-B03", dateEntree: "15/01/2024", statut: "Actif" },
  { id: 2, code: "ARC-2024-0098", titre: "Contrats Fournisseurs 2024", description: "Juridique", emplacement: "Zone B2-B12", dateEntree: "08/01/2024", statut: "Inactif" },
  { id: 3, code: "ARC-2023-0321", titre: "Rapport Financier Annuel 2023", description: "Finance", emplacement: "Zone C1-B05", dateEntree: "20/12/2023", statut: "Inactif" },
  { id: 4, code: "ARC-2024-0201", titre: "PV Réunion Direction Février", description: "Administration", emplacement: "Zone A2-B08", dateEntree: "02/02/2024", statut: "Actif" },
  { id: 5, code: "ARC-2024-0055", titre: "Factures Clients Janvier", description: "Comptabilité", emplacement: "Zone D1-B02", dateEntree: "31/01/2024", statut: "Actif" },
  { id: 6, code: "ARC-2023-0299", titre: "Plan Formation 2024", description: "Ressources Humaines", emplacement: "Zone A1-B07", dateEntree: "15/12/2023", statut: "Inactif" },
];

const descriptions = ["Tous", "Ressources Humaines", "Juridique", "Finance", "Administration", "Comptabilité"];
const statusMap = (s: string) => {
  if (s === "Actif") return "success" as const;
  if (s === "Inactif") return "danger" as const;
  return "neutral" as const;
};

const Archives = () => {
  const [data, setData] = useState(initialData);
  const [search, setSearch] = useState("");
  const [filterDesc, setFilterDesc] = useState("Tous");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailDialog, setDetailDialog] = useState<ArchiveItem | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editing, setEditing] = useState<ArchiveItem | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [form, setForm] = useState({ code: "", titre: "", description: "", emplacement: "", dateEntree: "", statut: "Actif" });

  const filtered = data.filter((a) => {
    const matchSearch = a.code.toLowerCase().includes(search.toLowerCase()) ||
      a.titre.toLowerCase().includes(search.toLowerCase());
    const matchDesc = filterDesc === "Tous" || a.description === filterDesc;
    return matchSearch && matchDesc;
  });

  const openAdd = () => {
    setEditing(null);
    setForm({ code: "", titre: "", description: "", emplacement: "", dateEntree: "", statut: "Disponible" });
    setDialogOpen(true);
  };

  const openEdit = (a: ArchiveItem) => {
    setEditing(a);
    setForm({ code: a.code, titre: a.titre, description: a.description, emplacement: a.emplacement, dateEntree: a.dateEntree, statut: a.statut });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.code || !form.titre) return;
    if (editing) {
      setData((p) => p.map((a) => a.id === editing.id ? { ...a, ...form } : a));
    } else {
      const newId = Math.max(...data.map((a) => a.id), 0) + 1;
      setData((p) => [...p, { id: newId, ...form }]);
    }
    setDialogOpen(false);
  };

  const confirmDelete = () => {
    if (deletingId !== null) {
      setData((p) => p.filter((a) => a.id !== deletingId));
      setDeletingId(null);
      setDeleteOpen(false);
    }
  };

  return (
    <PageContainer
      title="Gestion des Archives"
      subtitle={`${data.length} archives enregistrées`}
      actions={null}
    >
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <SearchBar value={search} onChange={setSearch} placeholder="Rechercher par code ou titre..." />
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-muted-foreground" />
          <div className="flex gap-1 flex-wrap">
            {descriptions.map((c) => (
              <button
                key={c}
                onClick={() => setFilterDesc(c)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filterDesc === c ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="section-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/40">
                <th className="table-header">Code à barre</th>
                <th className="table-header">Type d'archive</th>
                <th className="table-header">Description</th>
                <th className="table-header">Emplacement</th>
                <th className="table-header">Date d'entrée</th>
                <th className="table-header">Statut</th>
                <th className="table-header text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filtered.map((a) => (
                  <motion.tr
                    key={a.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-t border-border hover:bg-muted/20 transition-colors"
                  >
                    <td className="table-cell font-mono font-medium text-primary">{a.code}</td>
                    <td className="table-cell font-medium">{a.titre}</td>
                    <td className="table-cell"><StatusBadge status={a.description} variant="neutral" /></td>
                    <td className="table-cell text-muted-foreground">{a.emplacement}</td>
                    <td className="table-cell text-muted-foreground text-xs">{a.dateEntree}</td>
                    <td className="table-cell"><StatusBadge status={a.statut} variant={statusMap(a.statut)} /></td>
                    <td className="table-cell text-right">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => setDetailDialog(a)} className="p-2 rounded-lg text-muted-foreground hover:text-info hover:bg-info/10 transition-colors"><Eye size={16} /></button>
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

      {/* Detail Dialog */}
      <Dialog open={!!detailDialog} onOpenChange={() => setDetailDialog(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle className="flex items-center gap-2"><Archive size={20} className="text-primary" /> Détails de l'archive</DialogTitle></DialogHeader>
          {detailDialog && (
            <div className="space-y-3 py-2">
              {[
                ["Code à barre", detailDialog.code],
                ["Type d'archive", detailDialog.titre],
                ["Description", detailDialog.description],
                ["Emplacement", detailDialog.emplacement],
                ["Date d'entrée", detailDialog.dateEntree],
                ["Statut", detailDialog.statut],
              ].map(([label, val]) => (
                <div key={label} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                  <span className="text-sm text-muted-foreground">{label}</span>
                  <span className="text-sm font-medium text-foreground">{val}</span>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>{editing ? "Modifier l'archive" : "Nouvelle archive"}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            {[
              { key: "code", label: "Code à barre", placeholder: "ARC-XXXX-XXXX" },
              { key: "titre", label: "Type d'archive", placeholder: "Type du dossier" },
              { key: "description", label: "Description", placeholder: "Description de l'archive" },
              { key: "emplacement", label: "Emplacement", placeholder: "Zone XX-BXX" },
              { key: "dateEntree", label: "Date d'entrée", placeholder: "JJ/MM/AAAA" },
            ].map(({ key, label, placeholder }) => (
              <div key={key} className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">{label}</label>
                <input
                  value={form[key as keyof typeof form]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  placeholder={placeholder}
                  className="input-field"
                />
              </div>
            ))}
          </div>
          <DialogFooter>
            <button onClick={() => setDialogOpen(false)} className="btn-secondary">Annuler</button>
            <button onClick={handleSave} className="btn-primary">{editing ? "Enregistrer" : "Ajouter"}</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>Cette archive sera définitivement supprimée. Cette action est irréversible.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="btn-danger">Supprimer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageContainer>
  );
};

export default Archives;
