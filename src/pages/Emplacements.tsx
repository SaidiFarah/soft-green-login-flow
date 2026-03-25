import { useState } from "react";
import { Plus, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import PageContainer from "@/components/PageContainer";
import SearchBar from "@/components/SearchBar";
import EmptyState from "@/components/EmptyState";

interface Emplacement {
  id: number;
  code: string;
  nom: string;
  label: string;
  nombreZones: number;
  zonesOccupees: number;
}

const initial: Emplacement[] = [
  { id: 1, code: "EMP-01", nom: "Emplacement A — Administration", label: "Administration", nombreZones: 3, zonesOccupees: 1 },
  { id: 2, code: "EMP-02", nom: "Emplacement B — Ressources Humaines", label: "Ressources Humaines", nombreZones: 3, zonesOccupees: 1 },
  { id: 3, code: "EMP-03", nom: "Emplacement C — Finance & Comptabilité", label: "Finance & Comptabilité", nombreZones: 3, zonesOccupees: 2 },
  { id: 4, code: "EMP-04", nom: "Emplacement D — Juridique", label: "Juridique", nombreZones: 2, zonesOccupees: 1 },
  { id: 5, code: "EMP-05", nom: "Emplacement E — Logistique", label: "Logistique", nombreZones: 1, zonesOccupees: 0 },
  { id: 6, code: "EMP-06", nom: "Emplacement F — Direction Générale", label: "Direction Générale", nombreZones: 2, zonesOccupees: 1 },
];

const Emplacements = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(initial);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ libelle: "" });

  const filtered = data.filter((e) =>
    e.code.toLowerCase().includes(search.toLowerCase()) ||
    e.nom.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => { setForm({ libelle: "" }); setDialogOpen(true); };

  const handleSave = () => {
    if (!form.libelle) return;
    const newId = Math.max(...data.map((e) => e.id), 0) + 1;
    setData((p) => [...p, { id: newId, code: `EMP-${newId.toString().padStart(2, '0')}`, nom: form.libelle, label: form.libelle, nombreZones: 0, zonesOccupees: 0 }]);
    setDialogOpen(false);
  };

  const occupancyPct = (e: Emplacement) => e.nombreZones === 0 ? 0 : Math.round((e.zonesOccupees / e.nombreZones) * 100);
  const occupancyColor = (pct: number) => pct >= 90 ? "bg-destructive" : pct >= 70 ? "bg-warning" : "bg-success";

  return (
    <PageContainer title="Emplacements" subtitle="Cliquez sur un emplacement pour voir ses zones" actions={<button onClick={openAdd} className="btn-primary"><Plus size={18} /> Ajouter</button>}>
      <SearchBar value={search} onChange={setSearch} placeholder="Rechercher un emplacement..." />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <AnimatePresence>
          {filtered.map((e, i) => {
            const pct = occupancyPct(e);
            return (
              <motion.div
                key={e.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => navigate(`/scanner?emplacement=${encodeURIComponent(e.label)}`)}
                className="section-card p-5 hover:card-elevated-hover transition-shadow cursor-pointer group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors">{e.nom}</p>
                    <p className="text-xs font-mono text-muted-foreground">{e.code}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Zones occupées</span>
                    <span className="font-medium text-foreground">{e.zonesOccupees}/{e.nombreZones} zones</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.6, delay: i * 0.05 }} className={`h-full rounded-full ${occupancyColor(pct)}`} />
                  </div>
                  <p className="text-xs text-muted-foreground text-right">{pct}% occupé</p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
      {filtered.length === 0 && <EmptyState />}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Nouvel emplacement</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            {[
              { key: "libelle", label: "Libellé" },
            ].map(({ key, label }) => (
              <div key={key} className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">{label}</label>
                <input value={form[key as keyof typeof form]} onChange={(ev) => setForm({ ...form, [key]: ev.target.value })} className="input-field" />
              </div>
            ))}
          </div>
          <DialogFooter className="grid grid-cols-2 gap-3">
            <button onClick={() => setDialogOpen(false)} className="btn-secondary h-11 w-full">Annuler</button>
            <button onClick={handleSave} className="btn-primary h-11 w-full">Ajouter</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
};

export default Emplacements;
