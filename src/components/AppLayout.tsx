import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Outlet, useLocation } from "react-router-dom";

import { ThemeToggle } from "@/components/ThemeToggle";


const pageTitles: Record<string, string> = {
  "/dashboard": "Tableau de bord",
  "/archives": "Archives",
  "/emplacements": "Emplacements",
  "/scanner": "Scanner",
  "/historique": "Historique",
  "/utilisateurs": "Utilisateurs",
  "/profil": "Mon Profil",
};

export function AppLayout() {
  const location = useLocation();
  const title = pageTitles[location.pathname] || "Mazeraa Archive";

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
            <div className="flex items-center gap-1">
              <ThemeToggle />
            </div>
          </header>
          <main className="flex-1 p-4 sm:p-6 bg-background overflow-auto relative">
            <Outlet />
          </main>
        </div>
      </div>
      <AIAssistant />
    </SidebarProvider>
  );
}
