import { Package, Users, TrendingUp, ShoppingCart, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const kpis = [
  { title: "Produits", value: "1,245", icon: Package, change: "+12%", color: "bg-primary/10 text-primary" },
  { title: "Clients", value: "864", icon: Users, change: "+8%", color: "bg-accent/15 text-accent-foreground" },
  { title: "Commandes", value: "3,721", icon: ShoppingCart, change: "+23%", color: "bg-secondary text-secondary-foreground" },
  { title: "Revenue", value: "€ 542K", icon: TrendingUp, change: "+18%", color: "bg-primary/10 text-primary" },
];

const quickAccess = [
  { title: "Gérer les Produits", description: "Ajouter, modifier ou supprimer des produits", url: "/produits", icon: Package },
  { title: "Gérer les Clients", description: "Consulter et gérer la liste des clients", url: "/clients", icon: Users },
];

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Tableau de bord</h2>
        <p className="text-muted-foreground text-sm mt-1">Vue d'ensemble de votre activité</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <div
            key={kpi.title}
            className="bg-card rounded-xl border border-border p-5 login-card-shadow hover:scale-[1.02] transition-transform duration-200"
            style={{ animationDelay: `${i * 0.08}s` }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2.5 rounded-lg ${kpi.color}`}>
                <kpi.icon size={20} />
              </div>
              <span className="text-xs font-semibold text-primary">{kpi.change}</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
            <p className="text-sm text-muted-foreground">{kpi.title}</p>
          </div>
        ))}
      </div>

      {/* Quick Access */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Accès rapide</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quickAccess.map((item) => (
            <button
              key={item.title}
              onClick={() => navigate(item.url)}
              className="flex items-center gap-4 bg-card rounded-xl border border-border p-5 text-left hover:border-primary/40 hover:login-card-shadow transition-all duration-200 group"
            >
              <div className="p-3 rounded-lg bg-primary/10 text-primary">
                <item.icon size={24} />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground">{item.title}</p>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
              <ArrowRight size={20} className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
