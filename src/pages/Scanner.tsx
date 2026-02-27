import { useState } from "react";
import { ScanBarcode, Search, CheckCircle, AlertCircle, Archive, MapPin, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PageContainer from "@/components/PageContainer";
import StatusBadge from "@/components/StatusBadge";

interface ScanResult {
  code: string;
  titre: string;
  categorie: string;
  emplacement: string;
  statut: string;
  dernierMouvement: string;
}

const mockResults: Record<string, ScanResult> = {
  "ARC-2024-0142": { code: "ARC-2024-0142", titre: "Dossier RH - Recrutement Q1", categorie: "Ressources Humaines", emplacement: "Rayon A1-B03", statut: "En sortie", dernierMouvement: "Sortie le 26/02/2026 par Ahmed B." },
  "ARC-2024-0098": { code: "ARC-2024-0098", titre: "Contrats Fournisseurs 2024", categorie: "Juridique", emplacement: "Rayon B2-B12", statut: "Disponible", dernierMouvement: "Retour le 26/02/2026 par Fatima Z." },
  "ARC-2023-0321": { code: "ARC-2023-0321", titre: "Rapport Financier Annuel 2023", categorie: "Finance", emplacement: "Rayon C1-B05", statut: "En retard", dernierMouvement: "Sortie le 25/02/2026 par Karim M." },
};

const Scanner = () => {
  const [barcode, setBarcode] = useState("");
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [notFound, setNotFound] = useState(false);

  const handleScan = () => {
    if (!barcode.trim()) return;
    setScanning(true);
    setResult(null);
    setNotFound(false);

    setTimeout(() => {
      const found = mockResults[barcode.trim().toUpperCase()];
      if (found) {
        setResult(found);
        setNotFound(false);
      } else {
        setResult(null);
        setNotFound(true);
      }
      setScanning(false);
    }, 800);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleScan();
  };

  const statusVariant = (s: string) => {
    if (s === "Disponible") return "success" as const;
    if (s === "En sortie") return "info" as const;
    if (s === "En retard") return "danger" as const;
    return "neutral" as const;
  };

  return (
    <PageContainer title="Scanner Code-barres" subtitle="Scannez ou saisissez un code-barres pour rechercher une archive">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Scan Input */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="section-card p-6"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
              <ScanBarcode size={22} />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Saisie du code-barres</h3>
              <p className="text-xs text-muted-foreground">Scannez avec un lecteur ou saisissez manuellement</p>
            </div>
          </div>

          <div className="flex gap-3">
            <input
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ex: ARC-2024-0142"
              className="input-field flex-1 font-mono text-base tracking-wider"
              autoFocus
            />
            <button onClick={handleScan} disabled={scanning || !barcode.trim()} className="btn-primary px-6">
              {scanning ? (
                <div className="h-5 w-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                <><Search size={18} /> Scanner</>
              )}
            </button>
          </div>

          <p className="text-xs text-muted-foreground mt-3">
            Codes de test : ARC-2024-0142, ARC-2024-0098, ARC-2023-0321
          </p>
        </motion.div>

        {/* Result */}
        <AnimatePresence mode="wait">
          {result && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8 }}
              className="section-card p-6"
            >
              <div className="flex items-center gap-2 mb-5 text-success">
                <CheckCircle size={20} />
                <h3 className="font-semibold">Archive trouvée</h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                  <Archive size={20} className="text-primary" />
                  <div>
                    <p className="font-mono font-bold text-primary text-lg">{result.code}</p>
                    <p className="font-semibold text-foreground">{result.titre}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-lg border border-border">
                    <p className="text-xs text-muted-foreground mb-1">Catégorie</p>
                    <p className="text-sm font-medium text-foreground">{result.categorie}</p>
                  </div>
                  <div className="p-3.5 rounded-lg border border-border">
                    <p className="text-xs text-muted-foreground mb-1">Statut</p>
                    <StatusBadge status={result.statut} variant={statusVariant(result.statut)} />
                  </div>
                  <div className="p-3.5 rounded-lg border border-border flex items-start gap-2">
                    <MapPin size={14} className="text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Emplacement</p>
                      <p className="text-sm font-medium text-foreground">{result.emplacement}</p>
                    </div>
                  </div>
                  <div className="p-3.5 rounded-lg border border-border flex items-start gap-2">
                    <Clock size={14} className="text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Dernier mouvement</p>
                      <p className="text-sm font-medium text-foreground">{result.dernierMouvement}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button className="btn-primary flex-1">Enregistrer une sortie</button>
                  <button className="btn-secondary flex-1">Enregistrer un retour</button>
                </div>
              </div>
            </motion.div>
          )}

          {notFound && (
            <motion.div
              key="not-found"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="section-card p-8 text-center"
            >
              <div className="inline-flex p-3 rounded-full bg-destructive/10 text-destructive mb-4">
                <AlertCircle size={28} />
              </div>
              <h3 className="font-semibold text-foreground mb-1">Archive introuvable</h3>
              <p className="text-sm text-muted-foreground">
                Le code-barres « <span className="font-mono font-medium text-foreground">{barcode}</span> » ne correspond à aucune archive enregistrée.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageContainer>
  );
};

export default Scanner;
