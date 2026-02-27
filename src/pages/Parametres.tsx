import { Bell, Globe, Database, Save } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import PageContainer from "@/components/PageContainer";

const Parametres = () => {
  const handleSave = () => toast.success("Paramètres enregistrés");

  return (
    <PageContainer title="Paramètres" subtitle="Configuration du système d'archivage">
      <div className="max-w-2xl space-y-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="section-card p-6">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Globe size={18} className="text-primary" /> Général
          </h3>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Nom de l'organisation</label>
              <input defaultValue="El Mazraa" className="input-field" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Langue</label>
              <select defaultValue="fr" className="input-field">
                <option value="fr">Français</option>
                <option value="ar">العربية</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Format de code-barres</label>
              <input defaultValue="ARC-YYYY-XXXX" className="input-field font-mono" disabled />
              <p className="text-xs text-muted-foreground">Format automatique basé sur l'année et un numéro séquentiel</p>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="section-card p-6">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Bell size={18} className="text-primary" /> Notifications
          </h3>
          <div className="space-y-3">
            {[
              { label: "Notification de retard", desc: "Alerter quand une archive dépasse la durée de sortie autorisée" },
              { label: "Rapport hebdomadaire", desc: "Envoyer un résumé des mouvements chaque semaine" },
              { label: "Connexion inhabituelle", desc: "Alerter en cas de connexion depuis un nouveau poste" },
            ].map((n) => (
              <div key={n.label} className="flex items-center justify-between p-3.5 rounded-lg border border-border">
                <div>
                  <p className="text-sm font-medium text-foreground">{n.label}</p>
                  <p className="text-xs text-muted-foreground">{n.desc}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-10 h-5 bg-muted rounded-full peer peer-checked:bg-primary after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-card after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5" />
                </label>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="section-card p-6">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Database size={18} className="text-primary" /> Données
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3.5 rounded-lg border border-border">
              <div>
                <p className="text-sm font-medium text-foreground">Durée max de sortie</p>
                <p className="text-xs text-muted-foreground">Nombre de jours avant alerte retard</p>
              </div>
              <input type="number" defaultValue={7} className="input-field w-20 text-center" />
            </div>
            <div className="flex items-center justify-between p-3.5 rounded-lg border border-border">
              <div>
                <p className="text-sm font-medium text-foreground">Conservation historique</p>
                <p className="text-xs text-muted-foreground">Durée de conservation des logs (mois)</p>
              </div>
              <input type="number" defaultValue={24} className="input-field w-20 text-center" />
            </div>
          </div>
        </motion.div>

        <div className="flex justify-end">
          <button onClick={handleSave} className="btn-primary"><Save size={16} /> Enregistrer les paramètres</button>
        </div>
      </div>
    </PageContainer>
  );
};

export default Parametres;
