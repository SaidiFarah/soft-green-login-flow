import { useState } from "react";
import { Plus, Pencil, Trash2, Search, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Produit {
  id: number;
  nom: string;
  categorie: string;
  prix: number;
  stock: number;
}

const initialProduits: Produit[] = [
  { id: 1, nom: "Poulet Entier", categorie: "Volaille", prix: 450, stock: 120 },
  { id: 2, nom: "Escalope de Dinde", categorie: "Volaille", prix: 680, stock: 85 },
  { id: 3, nom: "Saucisse de Poulet", categorie: "Charcuterie", prix: 320, stock: 200 },
  { id: 4, nom: "Nuggets", categorie: "Surgelé", prix: 520, stock: 150 },
  { id: 5, nom: "Cordon Bleu", categorie: "Surgelé", prix: 490, stock: 95 },
];

const Produits = () => {
  const [produits, setProduits] = useState<Produit[]>(initialProduits);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingProduit, setEditingProduit] = useState<Produit | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [form, setForm] = useState({ nom: "", categorie: "", prix: "", stock: "" });

  const filtered = produits.filter(
    (p) =>
      p.nom.toLowerCase().includes(search.toLowerCase()) ||
      p.categorie.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setEditingProduit(null);
    setForm({ nom: "", categorie: "", prix: "", stock: "" });
    setDialogOpen(true);
  };

  const openEdit = (p: Produit) => {
    setEditingProduit(p);
    setForm({ nom: p.nom, categorie: p.categorie, prix: String(p.prix), stock: String(p.stock) });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.nom || !form.categorie || !form.prix || !form.stock) return;
    if (editingProduit) {
      setProduits((prev) =>
        prev.map((p) =>
          p.id === editingProduit.id
            ? { ...p, nom: form.nom, categorie: form.categorie, prix: Number(form.prix), stock: Number(form.stock) }
            : p
        )
      );
    } else {
      const newId = Math.max(...produits.map((p) => p.id), 0) + 1;
      setProduits((prev) => [
        ...prev,
        { id: newId, nom: form.nom, categorie: form.categorie, prix: Number(form.prix), stock: Number(form.stock) },
      ]);
    }
    setDialogOpen(false);
  };

  const confirmDelete = () => {
    if (deletingId !== null) {
      setProduits((prev) => prev.filter((p) => p.id !== deletingId));
      setDeletingId(null);
      setDeleteDialogOpen(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Produits</h2>
          <p className="text-muted-foreground text-sm mt-1">{produits.length} produits au total</p>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 px-5 h-11 rounded-lg bg-primary text-primary-foreground font-semibold hover:brightness-110 active:scale-[0.98] transition-all"
        >
          <Plus size={18} />
          Ajouter
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un produit..."
          className="w-full h-11 pl-10 pr-4 rounded-lg border border-input bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/40 focus:border-primary transition-all"
        />
        {search && (
          <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
            <X size={16} />
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden login-card-shadow">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-secondary/50">
                <th className="text-left px-5 py-3 font-semibold text-foreground">Nom</th>
                <th className="text-left px-5 py-3 font-semibold text-foreground">Catégorie</th>
                <th className="text-left px-5 py-3 font-semibold text-foreground">Prix (DA)</th>
                <th className="text-left px-5 py-3 font-semibold text-foreground">Stock</th>
                <th className="text-right px-5 py-3 font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3.5 font-medium text-foreground">{p.nom}</td>
                  <td className="px-5 py-3.5">
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      {p.categorie}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-foreground">{p.prix.toLocaleString()}</td>
                  <td className="px-5 py-3.5 text-foreground">{p.stock}</td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => openEdit(p)}
                        className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                        title="Modifier"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => { setDeletingId(p.id); setDeleteDialogOpen(true); }}
                        className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-muted-foreground">
                    Aucun produit trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingProduit ? "Modifier le produit" : "Ajouter un produit"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Nom</label>
              <input
                value={form.nom}
                onChange={(e) => setForm({ ...form, nom: e.target.value })}
                className="w-full h-10 px-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring/40 focus:border-primary transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Catégorie</label>
              <input
                value={form.categorie}
                onChange={(e) => setForm({ ...form, categorie: e.target.value })}
                className="w-full h-10 px-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring/40 focus:border-primary transition-all"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Prix (DA)</label>
                <input
                  type="number"
                  value={form.prix}
                  onChange={(e) => setForm({ ...form, prix: e.target.value })}
                  className="w-full h-10 px-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring/40 focus:border-primary transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Stock</label>
                <input
                  type="number"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  className="w-full h-10 px-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring/40 focus:border-primary transition-all"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <button
              onClick={() => setDialogOpen(false)}
              className="px-4 h-10 rounded-lg border border-border text-foreground hover:bg-muted transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleSave}
              className="px-5 h-10 rounded-lg bg-primary text-primary-foreground font-semibold hover:brightness-110 transition-all"
            >
              {editingProduit ? "Enregistrer" : "Ajouter"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer ce produit ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Produits;
