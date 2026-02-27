import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Outlet, useLocation } from "react-router-dom";
import { Bell } from "lucide-react";

const pageTitles: Record<string, string> = {
  "/dashboard": "Tableau de bord",
  "/archives": "Archives",
  "/emplacements": "Emplacements",
  "/scanner": "Scanner",
  "/historique": "Historique",
  "/utilisateurs": "Utilisateurs",
  "/parametres": "Paramètres",
  "/profil": "Mon Profil",
};

export function AppLayout() {
  const location = useLocation();
  const title = pageTitles[location.pathname] || "El Mazraa";

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center justify-between border-b border-border px-4 bg-card sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
              <div className="h-5 w-px bg-border hidden sm:block" />
              <span className="text-sm font-medium text-muted-foreground hidden sm:block">{title}</span>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors relative">
                <Bell size={18} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-destructive" />
              </button>
            </div>
          </header>
          <main className="flex-1 p-4 sm:p-6 bg-background overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
