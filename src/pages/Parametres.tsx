import { Settings } from "lucide-react";

const Parametres = () => (
  <div className="space-y-6 animate-fade-in">
    <div>
      <h2 className="text-2xl font-bold text-foreground">Paramètres</h2>
      <p className="text-muted-foreground text-sm mt-1">Gérer les paramètres de l'application</p>
    </div>
    <div className="bg-card rounded-xl border border-border p-12 flex flex-col items-center justify-center text-center login-card-shadow">
      <div className="p-4 rounded-full bg-primary/10 text-primary mb-4">
        <Settings size={32} />
      </div>
      <p className="text-lg font-semibold text-foreground">Page en construction</p>
      <p className="text-sm text-muted-foreground mt-1">Cette section sera disponible prochainement</p>
    </div>
  </div>
);

export default Parametres;
