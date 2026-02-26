import { useState } from "react";
import { Plus, Pencil, Trash2, Search, X } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Client {
  id: number;
  nom: string;
  email: string;
  telephone: string;
  ville: string;
}

const initialClients: Client[] = [
  { id: 1, nom: "Ahmed Benali", email: "ahmed@example.com", telephone: "0551234567", ville: "Alger" },
  { id: 2, nom: "Fatima Zahra", email: "fatima@example.com", telephone: "0667891234", ville: "Oran" },
  { id: 3, nom: "Karim Mourad", email: "karim@example.com", telephone: "0778456123", ville: "Constantine" },
  { id: 4, nom: "Sara Boudiaf", email: "sara@example.com", telephone: "0559871234", ville: "Blida" },
];

const Clients = () => {
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Client | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [form, setForm] = useState({ nom: "", email: "", telephone: "", ville: "" });

  const filtered = clients.filter(
    (c) => c.nom.toLowerCase().includes(search.toLowerCase()) || c.ville.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => { setEditing(null); setForm({ nom: "", email: "", telephone: "", ville: "" }); setDialogOpen(true); };
  const openEdit = (c: Client) => { setEditing(c); setForm({ nom: c.nom, email: c.email, telephone: c.telephone, ville: c.ville }); setDialogOpen(true); };

  const handleSave = () => {
    if (!form.nom || !form.email) return;
    if (editing) {
      setClients((prev) => prev.map((c) => c.id === editing.id ? { ...c, ...form } : c));
    } else {
      const newId = Math.max(...clients.map((c) => c.id), 0) + 1;
      setClients((prev) => [...prev, { id: newId, ...form }]);
    }
    setDialogOpen(false);
  };

  const confirmDelete = () => {
    if (deletingId !== null) {
      setClients((prev) => prev.filter((c) => c.id !== deletingId));
      setDeletingId(null);
      setDeleteDialogOpen(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Clients</h2>
          <p className="text-muted-foreground text-sm mt-1">{clients.length} clients au total</p>
        </div>
        <button onClick={openAdd} className="inline-flex items-center gap-2 px-5 h-11 rounded-lg bg-primary text-primary-foreground font-semibold hover:brightness-110 active:scale-[0.98] transition-all">
          <Plus size={18} /> Ajouter
        </button>
      </div>

      <div className="relative max-w-sm">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher un client..."
          className="w-full h-11 pl-10 pr-4 rounded-lg border border-input bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/40 focus:border-primary transition-all" />
        {search && <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"><X size={16} /></button>}
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden login-card-shadow">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-secondary/50">
                <th className="text-left px-5 py-3 font-semibold text-foreground">Nom</th>
                <th className="text-left px-5 py-3 font-semibold text-foreground">Email</th>
                <th className="text-left px-5 py-3 font-semibold text-foreground">Téléphone</th>
                <th className="text-left px-5 py-3 font-semibold text-foreground">Ville</th>
                <th className="text-right px-5 py-3 font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3.5 font-medium text-foreground">{c.nom}</td>
                  <td className="px-5 py-3.5 text-foreground">{c.email}</td>
                  <td className="px-5 py-3.5 text-foreground">{c.telephone}</td>
                  <td className="px-5 py-3.5"><span className="px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">{c.ville}</span></td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => openEdit(c)} className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"><Pencil size={16} /></button>
                      <button onClick={() => { setDeletingId(c.id); setDeleteDialogOpen(true); }} className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={5} className="px-5 py-12 text-center text-muted-foreground">Aucun client trouvé</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>{editing ? "Modifier le client" : "Ajouter un client"}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            {(["nom", "email", "telephone", "ville"] as const).map((field) => (
              <div key={field} className="space-y-1.5">
                <label className="text-sm font-medium text-foreground capitalize">{field === "telephone" ? "Téléphone" : field.charAt(0).toUpperCase() + field.slice(1)}</label>
                <input value={form[field]} onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                  className="w-full h-10 px-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring/40 focus:border-primary transition-all" />
              </div>
            ))}
          </div>
          <DialogFooter>
            <button onClick={() => setDialogOpen(false)} className="px-4 h-10 rounded-lg border border-border text-foreground hover:bg-muted transition-colors">Annuler</button>
            <button onClick={handleSave} className="px-5 h-10 rounded-lg bg-primary text-primary-foreground font-semibold hover:brightness-110 transition-all">{editing ? "Enregistrer" : "Ajouter"}</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>Êtes-vous sûr de vouloir supprimer ce client ? Cette action est irréversible.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Supprimer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Clients;
