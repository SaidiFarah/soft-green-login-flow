import { useState } from "react";
import { Plus, Pencil, Trash2, Archive, MapPin, CheckCircle, XCircle, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import PageContainer from "@/components/PageContainer";
import SearchBar from "@/components/SearchBar";
import EmptyState from "@/components/EmptyState";

interface Zone {
  id: number;
  code: string;
  nom: string;
  type: string;
  emplacement: string;
  capacite: number;
  occupe: number;
  statut: "Disponible" | "Occupée" | "Pleine";
  etat?: string;
}

const initial: Zone[] = [
  { id: 1, code: "Z-01", nom: "Zone Factures", type: "Factures", emplacement: "Administration", capacite: 120, occupe: 45, statut: "Disponible" },
  { id: 2, code: "Z-02", nom: "Zone Courriers", type: "Courriers officiels", emplacement: "Administration", capacite: 80, occupe: 80, statut: "Pleine" },
  { id: 3, code: "Z-03", nom: "Zone PV Réunions", type: "Procès-verbaux", emplacement: "Administration", capacite: 60, occupe: 30, statut: "Disponible" },
  { id: 4, code: "Z-04", nom: "Zone Dossiers Employés", type: "Dossiers personnel", emplacement: "Ressources Humaines", capacite: 100, occupe: 67, statut: "Disponible" },
  { id: 5, code: "Z-05", nom: "Zone Contrats Travail", type: "Contrats", emplacement: "Ressources Humaines", capacite: 60, occupe: 58, statut: "Occupée" },
  { id: 6, code: "Z-06", nom: "Zone Formations", type: "Plans de formation", emplacement: "Ressources Humaines", capacite: 40, occupe: 12, statut: "Disponible" },
  { id: 7, code: "Z-07", nom: "Zone Bilans", type: "Bilans financiers", emplacement: "Finance & Comptabilité", capacite: 90, occupe: 88, statut: "Occupée" },
  { id: 8, code: "Z-08", nom: "Zone Factures Fournisseurs", type: "Factures", emplacement: "Finance & Comptabilité", capacite: 110, occupe: 110, statut: "Pleine" },
  { id: 9, code: "Z-09", nom: "Zone Déclarations Fiscales", type: "Fiscalité", emplacement: "Finance & Comptabilité", capacite: 70, occupe: 45, statut: "Disponible" },
  { id: 10, code: "Z-10", nom: "Zone Contrats Clients", type: "Contrats", emplacement: "Juridique", capacite: 80, occupe: 35, statut: "Disponible" },
  { id: 11, code: "Z-11", nom: "Zone Litiges", type: "Dossiers juridiques", emplacement: "Juridique", capacite: 50, occupe: 50, statut: "Pleine" },
  { id: 12, code: "Z-12", nom: "Zone Bons de Livraison", type: "Logistique", emplacement: "Logistique", capacite: 90, occupe: 22, statut: "Disponible" },
  { id: 13, code: "Z-13", nom: "Zone Notes Direction", type: "Notes internes", emplacement: "Direction Générale", capacite: 40, occupe: 40, statut: "Pleine" },
  { id: 14, code: "Z-14", nom: "Zone Rapports Stratégiques", type: "Rapports", emplacement: "Direction Générale", capacite: 50, occupe: 28, statut: "Disponible" },
];

const Zones = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const emplacementFilter = searchParams.get("emplacement");

  const [data, setData] = useState(initial);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editing, setEditing] = useState<Zone | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [form, setForm] = useState({ libelle: "", capacite: "", etat: "Actif" });

  const baseData = emplacementFilter ? data.filter((z) => z.emplacement === emplacementFilter) : data;

  const filtered = baseData.filter((z) =>
    z.nom.toLowerCase().includes(search.toLowerCase()) ||
    z.code.toLowerCase().includes(search.toLowerCase()) ||
    z.type.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setEditing(null);
    setForm({ libelle: "", capacite: "", etat: "Actif" });
    setDialogOpen(true);
  };

  const openEdit = (z: Zone) => {
    setEditing(z);
    setForm({ libelle: z.nom, capacite: String(z.capacite), etat: z.etat || "Actif" });
    setDialogOpen(true);
  };

  const getStatut = (occ: number, cap: number): Zone["statut"] => {
    if (occ >= cap) return "Pleine";
    if (occ >= cap * 0.9) return "Occupée";
    return "Disponible";
  };

  const handleSave = () => {
    if (!form.libelle) return;
    const cap = Number(form.capacite) || 0;
    const occ = editing ? editing.occupe : 0;
    const statut = getStatut(occ, cap);
    const emp = emplacementFilter || "";
    if (editing) {
      setData((p) => p.map((z) => z.id === editing.id ? { ...z, nom: form.libelle, capacite: cap, statut, etat: form.etat } : z));
    } else {
      setData((p) => {
        const newId = Math.max(...p.map((z) => z.id), 0) + 1;
        return [...p, { id: newId, code: `Z-${newId.toString().padStart(2, '0')}`, nom: form.libelle, type: "Non spécifié", emplacement: emp, capacite: cap, occupe: occ, statut, etat: form.etat }];
      });
    }
    setDialogOpen(false);
  };

  const confirmDelete = () => {
    if (deletingId !== null) {
      setData((p) => p.filter((z) => z.id !== deletingId));
      setDeletingId(null);
      setDeleteOpen(false);
    }
  };

  const pct = (z: Zone) => z.capacite > 0 ? Math.round((z.occupe / z.capacite) * 100) : 0;

  const statutColor = (s: Zone["statut"]) => {
    if (s === "Disponible") return "bg-success/15 text-success border-success/30";
    if (s === "Occupée") return "bg-warning/15 text-warning border-warning/30";
    return "bg-destructive/15 text-destructive border-destructive/30";
  };

  const barColor = (p: number) => p >= 100 ? "bg-destructive" : p >= 90 ? "bg-warning" : "bg-success";

  const StatutIcon = ({ statut }: { statut: Zone["statut"] }) =>
    statut === "Disponible" ? <CheckCircle size={14} /> : <XCircle size={14} />;

  const subtitle = emplacementFilter
    ? `Zones de l'emplacement « ${emplacementFilter} »`
    : "Gérez les zones dédiées au stockage des archives par type";

  return (
    <PageContainer
      title={emplacementFilter ? `Zones — ${emplacementFilter}` : "Zones de stockage"}
      subtitle={subtitle}
      actions={<button onClick={openAdd} className="btn-primary"><Plus size={18} /> Ajouter une zone</button>}
    >
      {emplacementFilter && (
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate("/emplacements")}
          className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 font-medium transition-colors mb-1"
        >
          <ArrowLeft size={16} /> Retour aux emplacements
        </motion.button>
      )}

      {!emplacementFilter && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="section-card p-4 border-l-4 border-primary"
        >
          <p className="text-sm text-muted-foreground">
            Chaque zone correspond à un type précis d'archive. Le système indique les zones <span className="text-success font-medium">disponibles</span> et celles déjà <span className="text-destructive font-medium">occupées</span>.
          </p>
        </motion.div>
      )}

      <SearchBar value={search} onChange={setSearch} placeholder="Rechercher une zone..." />

      {/* KPI row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total zones", value: baseData.length, icon: MapPin, color: "text-primary" },
          { label: "Disponibles", value: baseData.filter((z) => z.statut === "Disponible").length, icon: CheckCircle, color: "text-success" },
          { label: "Pleines", value: baseData.filter((z) => z.statut === "Pleine").length, icon: XCircle, color: "text-destructive" },
        ].map((kpi, i) => (
          <motion.div key={kpi.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="section-card p-4 flex items-center gap-3">
            <div className={`p-2.5 rounded-lg bg-muted ${kpi.color}`}><kpi.icon size={20} /></div>
            <div>
              <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
              <p className="text-xs text-muted-foreground">{kpi.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Zone cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <AnimatePresence>
          {filtered.map((z, i) => {
            const p = pct(z);
            return (
              <motion.div
                key={z.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.05 }}
                className="section-card p-5 hover:card-elevated-hover transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
                      <Archive size={18} />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-sm">{z.nom}</p>
                      <p className="text-xs font-mono text-muted-foreground">{z.code}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(z)} className="p-1.5 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"><Pencil size={14} /></button>
                  </div>
                </div>

                <div className="mb-3">
                  <p className="text-xs text-muted-foreground mb-1">Type d'archive</p>
                  <p className="text-sm font-medium text-foreground">{z.type}</p>
                </div>

                {!emplacementFilter && (
                  <div className="mb-3">
                    <p className="text-xs text-muted-foreground mb-1">Emplacement</p>
                    <p className="text-sm font-medium text-foreground">{z.emplacement}</p>
                  </div>
                )}

                <div className="flex items-center justify-between mb-2">
                  <div className="flex gap-1.5 flex-wrap">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${statutColor(z.statut)}`}>
                      <StatutIcon statut={z.statut} />
                      {z.statut}
                    </span>
                    <span className={`inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full border ${(!z.etat || z.etat === 'Actif') ? 'bg-blue-500/15 text-blue-600 border-blue-500/30 dark:text-blue-400' : 'bg-muted text-muted-foreground border-border'}`}>
                      {(!z.etat || z.etat === 'Actif') ? 'Actif' : 'Inactif'}
                    </span>
                  </div>
                  <span className="text-xs font-medium text-foreground whitespace-nowrap">{z.occupe}/{z.capacite}</span>
                </div>

                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${p}%` }}
                    transition={{ duration: 0.6, delay: i * 0.05 }}
                    className={`h-full rounded-full ${barColor(p)}`}
                  />
                </div>
                <p className="text-xs text-muted-foreground text-right mt-1">{p}% occupé</p>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && <EmptyState />}

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? "Modifier la zone" : "Nouvelle zone"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {[
              { key: "libelle", label: "Libellé", placeholder: "Ex: Zone Factures" },
              { key: "capacite", label: "Capacité", placeholder: "Ex: 100" },
            ].map(({ key, label, placeholder }) => (
              <div key={key} className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">{label}</label>
                <input
                  value={form[key as keyof typeof form]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  placeholder={placeholder}
                  className={`input-field ${editing ? 'opacity-60 cursor-not-allowed bg-muted' : ''}`}
                  disabled={!!editing}
                />
              </div>
            ))}
            {editing && (
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">État de la zone</label>
                <select
                  value={form.etat}
                  onChange={(e) => setForm({ ...form, etat: e.target.value })}
                  className="input-field"
                >
                  <option value="Actif">Actif</option>
                  <option value="Inactif">Inactif</option>
                </select>
              </div>
            )}
          </div>
          <DialogFooter className="grid grid-cols-2 gap-3">
            <button onClick={() => setDialogOpen(false)} className="btn-secondary h-11 w-full">Annuler</button>
            <button onClick={handleSave} className="btn-primary h-11 w-full">{editing ? "Enregistrer" : "Ajouter"}</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cette zone ?</AlertDialogTitle>
            <AlertDialogDescription>Cette action est irréversible. Toutes les données liées seront perdues.</AlertDialogDescription>
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

export default Zones;
