import { useState } from "react";
import { History, Download, Filter } from "lucide-react";
import { motion } from "framer-motion";
import PageContainer from "@/components/PageContainer";
import SearchBar from "@/components/SearchBar";
import StatusBadge from "@/components/StatusBadge";
import EmptyState from "@/components/EmptyState";

interface Mouvement {
  id: number;
  codeArchive: string;
  titreArchive: string;
  action: "Entrée" | "Sortie" | "Retour" | "Consultation" | "Transfert";
  agent: string;
  date: string;
  heure: string;
  details: string;
}

const mouvements: Mouvement[] = [
  { id: 1, codeArchive: "ARC-2024-0142", titreArchive: "Dossier RH - Recrutement Q1", action: "Sortie", agent: "Ahmed Benali", date: "26/02/2026", heure: "09:15", details: "Demandé par la direction RH" },
  { id: 2, codeArchive: "ARC-2024-0098", titreArchive: "Contrats Fournisseurs 2024", action: "Retour", agent: "Fatima Zahra", date: "26/02/2026", heure: "08:45", details: "Retour après consultation" },
  { id: 3, codeArchive: "ARC-2023-0321", titreArchive: "Rapport Financier 2023", action: "Sortie", agent: "Karim Mourad", date: "25/02/2026", heure: "16:30", details: "Audit externe" },
  { id: 4, codeArchive: "ARC-2024-0201", titreArchive: "PV Réunion Direction", action: "Consultation", agent: "Sara Boudiaf", date: "25/02/2026", heure: "14:00", details: "Consultation sur place" },
  { id: 5, codeArchive: "ARC-2024-0055", titreArchive: "Factures Clients Janvier", action: "Retour", agent: "Youcef Djaballah", date: "25/02/2026", heure: "11:20", details: "Retour complet" },
  { id: 6, codeArchive: "ARC-2024-0142", titreArchive: "Dossier RH - Recrutement Q1", action: "Entrée", agent: "Ahmed Benali", date: "15/01/2024", heure: "10:00", details: "Première entrée dans le système" },
  { id: 7, codeArchive: "ARC-2023-0299", titreArchive: "Plan Formation 2024", action: "Transfert", agent: "Fatima Zahra", date: "24/02/2026", heure: "09:30", details: "Transfert de RAY-A1 vers RAY-C2" },
  { id: 8, codeArchive: "ARC-2024-0098", titreArchive: "Contrats Fournisseurs 2024", action: "Sortie", agent: "Karim Mourad", date: "20/02/2026", heure: "13:15", details: "Révision juridique" },
];

const actionColors = {
  "Entrée": "success" as const,
  "Sortie": "warning" as const,
  "Retour": "info" as const,
  "Consultation": "neutral" as const,
  "Transfert": "info" as const,
};

const actionTypes = ["Tous", "Entrée", "Sortie", "Retour", "Consultation", "Transfert"];

const Historique = () => {
  const [search, setSearch] = useState("");
  const [filterAction, setFilterAction] = useState("Tous");

  const filtered = mouvements.filter((m) => {
    const matchSearch = m.codeArchive.toLowerCase().includes(search.toLowerCase()) ||
      m.agent.toLowerCase().includes(search.toLowerCase()) ||
      m.titreArchive.toLowerCase().includes(search.toLowerCase());
    const matchAction = filterAction === "Tous" || m.action === filterAction;
    return matchSearch && matchAction;
  });

  return (
    <PageContainer
      title="Historique & Traçabilité"
      subtitle="Journal de tous les mouvements d'archives"
      actions={<button className="btn-secondary"><Download size={16} /> Exporter</button>}
    >
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <SearchBar value={search} onChange={setSearch} placeholder="Rechercher par code, agent ou titre..." />
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-muted-foreground" />
          <div className="flex gap-1 flex-wrap">
            {actionTypes.map((a) => (
              <button key={a} onClick={() => setFilterAction(a)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filterAction === a ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}
              >{a}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="section-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="bg-muted/40">
              <th className="table-header">Date & Heure</th>
              <th className="table-header">Code Archive</th>
              <th className="table-header">Titre</th>
              <th className="table-header">Action</th>
              <th className="table-header">Agent</th>
              <th className="table-header">Détails</th>
            </tr></thead>
            <tbody>
              {filtered.map((m, i) => (
                <motion.tr
                  key={m.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-t border-border hover:bg-muted/20 transition-colors"
                >
                  <td className="table-cell">
                    <div>
                      <p className="text-sm font-medium text-foreground">{m.date}</p>
                      <p className="text-xs text-muted-foreground">{m.heure}</p>
                    </div>
                  </td>
                  <td className="table-cell font-mono font-medium text-primary">{m.codeArchive}</td>
                  <td className="table-cell text-sm">{m.titreArchive}</td>
                  <td className="table-cell"><StatusBadge status={m.action} variant={actionColors[m.action]} /></td>
                  <td className="table-cell font-medium">{m.agent}</td>
                  <td className="table-cell text-xs text-muted-foreground max-w-[200px] truncate">{m.details}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <EmptyState />}
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <History size={14} />
        <span>{filtered.length} mouvement(s) affiché(s) sur {mouvements.length}</span>
      </div>
    </PageContainer>
  );
};

export default Historique;
