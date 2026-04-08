import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2 } from "lucide-react";
import PageContainer from "@/components/PageContainer";
import SearchBar from "@/components/SearchBar";
import StatusBadge from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ArchiveType {
  id: number;
  code: string;
  nom: string;
  description: string;
  duree: string;
  confidentialite: "Public" | "Interne" | "Confidentiel";
  statut: "Actif" | "Inactif";
}

const initial: ArchiveType[] = [
  { id: 1, code: "ARC-TYP-001", nom: "Contrat", description: "Documents contractuels", duree: "10 ans", confidentialite: "Confidentiel", statut: "Actif" },
  { id: 2, code: "ARC-TYP-002", nom: "Facture", description: "Pièces comptables", duree: "10 ans", confidentialite: "Interne", statut: "Actif" },
  { id: 3, code: "ARC-TYP-003", nom: "Dossier RH", description: "Documents employés", duree: "5 ans", confidentialite: "Confidentiel", statut: "Actif" },
  { id: 4, code: "ARC-TYP-004", nom: "Courrier", description: "Correspondances administratives", duree: "3 ans", confidentialite: "Public", statut: "Inactif" },
];

const confColors: Record<string, "danger" | "warning" | "info"> = {
  Confidentiel: "danger",
  Interne: "warning",
  Public: "info",
};

const ArchiveTypes = () => {
  const [data, setData] = useState<ArchiveType[]>(initial);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<ArchiveType | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [form, setForm] = useState({ code: "", nom: "", description: "", duree: "", confidentialite: "Public" as ArchiveType["confidentialite"], statut: "Actif" as ArchiveType["statut"] });
  const [error, setError] = useState("");

  const filtered = data.filter((t) =>
    [t.code, t.nom, t.description].some((v) => v.toLowerCase().includes(search.toLowerCase()))
  );

  const openAdd = () => {
    setEditing(null);
    setForm({ code: "", nom: "", description: "", duree: "", confidentialite: "Public", statut: "Actif" });
    setError("");
    setDialogOpen(true);
  };

  const openEdit = (t: ArchiveType) => {
    setEditing(t);
    setForm({ code: t.code, nom: t.nom, description: t.description, duree: t.duree, confidentialite: t.confidentialite, statut: t.statut });
    setError("");
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.nom.trim() || !form.code.trim()) { setError("Le code et le nom sont obligatoires."); return; }
    if (editing) {
      setData((d) => d.map((t) => t.id === editing.id ? { ...t, ...form } : t));
    } else {
      setData((d) => [...d, { id: Date.now(), ...form }]);
    }
    setDialogOpen(false);
  };

  const confirmDelete = () => {
    if (deletingId !== null) setData((d) => d.filter((t) => t.id !== deletingId));
    setDeleteOpen(false);
    setDeletingId(null);
  };

  return (
    <PageContainer
      title="Types d'archive"
      subtitle="Gestion des types d'archives"
      actions={<Button onClick={openAdd} size="sm"><Plus className="h-4 w-4 mr-1" /> Ajouter</Button>}
    >
      <SearchBar value={search} onChange={setSearch} placeholder="Rechercher un type..." />

      <div className="card-base overflow-hidden mt-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Nom du type</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Durée de conservation</TableHead>
              <TableHead>Confidentialité</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence mode="popLayout">
              {filtered.map((t) => (
                <motion.tr
                  key={t.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="border-b last:border-0"
                >
                  <TableCell className="font-mono text-xs">{t.code}</TableCell>
                  <TableCell className="font-medium">{t.nom}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{t.description}</TableCell>
                  <TableCell>{t.duree}</TableCell>
                  <TableCell><StatusBadge status={t.confidentialite} variant={confColors[t.confidentialite]} /></TableCell>
                  <TableCell><StatusBadge status={t.statut} variant={t.statut === "Actif" ? "success" : "neutral"} /></TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(t)} title="Modifier"><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => { setDeletingId(t.id); setDeleteOpen(true); }} title="Supprimer" className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </TableCell>
                </motion.tr>
              ))}
            </AnimatePresence>
          </TableBody>
        </Table>
        {filtered.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">Aucun type d'archive trouvé.</div>
        )}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? "Modifier le type" : "Ajouter un type d'archive"}</DialogTitle>
            <DialogDescription>{editing ? "Modifiez les informations du type d'archive." : "Remplissez les informations pour créer un nouveau type."}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {error && <p className="text-sm text-destructive">{error}</p>}
            <div className="space-y-1.5">
              <Label>Code</Label>
              <Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="ARC-TYP-005" />
            </div>
            <div className="space-y-1.5">
              <Label>Nom du type</Label>
              <Input value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} placeholder="Ex: Contrat" />
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description du type..." rows={3} />
            </div>
            <div className="space-y-1.5">
              <Label>Durée de conservation</Label>
              <Input value={form.duree} onChange={(e) => setForm({ ...form, duree: e.target.value })} placeholder="Ex: 10 ans" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Confidentialité</Label>
                <Select value={form.confidentialite} onValueChange={(v) => setForm({ ...form, confidentialite: v as ArchiveType["confidentialite"] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Public">Public</SelectItem>
                    <SelectItem value="Interne">Interne</SelectItem>
                    <SelectItem value="Confidentiel">Confidentiel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Statut</Label>
                <Select value={form.statut} onValueChange={(v) => setForm({ ...form, statut: v as ArchiveType["statut"] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Actif">Actif</SelectItem>
                    <SelectItem value="Inactif">Inactif</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleSave}>{editing ? "Enregistrer" : "Créer"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>Cette action est irréversible. Voulez-vous vraiment supprimer ce type d'archive ?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Supprimer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageContainer>
  );
};

export default ArchiveTypes;
