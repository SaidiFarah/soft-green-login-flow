import { Archive, ArrowDownRight, ArrowUpRight, Clock, AlertTriangle, BarChart3, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import PageContainer from "@/components/PageContainer";
import KpiCard from "@/components/KpiCard";
import StatusBadge from "@/components/StatusBadge";

const recentMovements = [
  { id: 1, archive: "ARC-2024-0142", action: "Sortie", agent: "Ahmed B.", date: "26/02/2026 09:15", status: "En cours" },
  { id: 2, archive: "ARC-2024-0098", action: "Retour", agent: "Fatima Z.", date: "26/02/2026 08:45", status: "Complété" },
  { id: 3, archive: "ARC-2023-0321", action: "Sortie", agent: "Karim M.", date: "25/02/2026 16:30", status: "En retard" },
  { id: 4, archive: "ARC-2024-0201", action: "Consultation", agent: "Sara B.", date: "25/02/2026 14:00", status: "Complété" },
  { id: 5, archive: "ARC-2024-0055", action: "Retour", agent: "Youcef D.", date: "25/02/2026 11:20", status: "Complété" },
];

const statusVariant = (s: string) => {
  if (s === "Complété") return "success";
  if (s === "En cours") return "info";
  if (s === "En retard") return "danger";
  return "neutral";
};

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <PageContainer title="Tableau de bord" subtitle="Vue d'ensemble du système d'archivage">
      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title="Total Archives" value="4,287" icon={Archive} change="+24 ce mois" changeType="up" color="primary" index={0} />
        <KpiCard title="Entrées ce mois" value="156" icon={ArrowDownRight} change="+12%" changeType="up" color="success" index={1} />
        <KpiCard title="Sorties ce mois" value="89" icon={ArrowUpRight} change="-5%" changeType="down" color="info" index={2} />
        <KpiCard title="En retard" value="7" icon={AlertTriangle} change="3 urgentes" changeType="down" color="destructive" index={3} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent movements */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.4 }}
          className="lg:col-span-2 section-card"
        >
          <div className="flex items-center justify-between p-5 border-b border-border">
            <div className="flex items-center gap-2">
              <Clock size={18} className="text-primary" />
              <h3 className="font-semibold text-foreground">Derniers mouvements</h3>
            </div>
            <button onClick={() => navigate("/historique")} className="btn-ghost text-xs">
              Voir tout <ArrowRight size={14} />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/40">
                  <th className="table-header">Code Archive</th>
                  <th className="table-header">Action</th>
                  <th className="table-header">Agent</th>
                  <th className="table-header">Date</th>
                  <th className="table-header">Statut</th>
                </tr>
              </thead>
              <tbody>
                {recentMovements.map((m) => (
                  <tr key={m.id} className="border-t border-border hover:bg-muted/20 transition-colors">
                    <td className="table-cell font-mono font-medium text-primary">{m.archive}</td>
                    <td className="table-cell">{m.action}</td>
                    <td className="table-cell">{m.agent}</td>
                    <td className="table-cell text-muted-foreground text-xs">{m.date}</td>
                    <td className="table-cell"><StatusBadge status={m.status} variant={statusVariant(m.status)} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Quick access */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.4 }}
          className="section-card p-5 space-y-4"
        >
          <div className="flex items-center gap-2">
            <BarChart3 size={18} className="text-primary" />
            <h3 className="font-semibold text-foreground">Accès rapide</h3>
          </div>
          {[
            { label: "Scanner un code-barres", url: "/scanner", desc: "Scan rapide d'archive" },
            { label: "Ajouter une archive", url: "/archives", desc: "Nouvelle entrée" },
            { label: "Voir les emplacements", url: "/emplacements", desc: "Rayons et dépôts" },
            { label: "Gérer les utilisateurs", url: "/utilisateurs", desc: "Rôles et accès" },
          ].map((item) => (
            <button
              key={item.url}
              onClick={() => navigate(item.url)}
              className="w-full flex items-center justify-between p-3.5 rounded-lg border border-border hover:border-primary/30 hover:bg-primary/[0.03] transition-all group text-left"
            >
              <div>
                <p className="text-sm font-medium text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
              <ArrowRight size={16} className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </button>
          ))}
        </motion.div>
      </div>
    </PageContainer>
  );
};

export default Dashboard;
