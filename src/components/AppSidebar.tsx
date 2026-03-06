import {
  LayoutDashboard, Archive, MapPin, Users, History, ScanBarcode,
  LogOut,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/logo.jpg";

import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarFooter, useSidebar,
} from "@/components/ui/sidebar";

const mainNav = [
  { title: "Tableau de bord", url: "/dashboard", icon: LayoutDashboard },
  { title: "Archives", url: "/archives", icon: Archive },
  { title: "Emplacements", url: "/emplacements", icon: MapPin },
  { title: "Scanner", url: "/scanner", icon: ScanBarcode },
  { title: "Historique", url: "/historique", icon: History },
];

const adminNav = [
  { title: "Utilisateurs", url: "/utilisateurs", icon: Users },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const navigate = useNavigate();

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      {/* Logo Header */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="relative shrink-0">
            <div className="absolute -inset-1 rounded-xl bg-gradient-to-br from-sidebar-primary/40 to-sidebar-primary/10 blur-sm" />
            <img
              src={logo}
              alt="El Mazraa"
              className={`relative ${collapsed ? "h-8 w-8" : "h-11 w-11"} rounded-lg object-cover ring-2 ring-sidebar-primary/30 transition-all duration-300`}
            />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-sm font-bold text-sidebar-accent-foreground font-heading tracking-tight truncate">
                El Mazraa
              </p>
              <p className="text-[10px] text-sidebar-muted tracking-wide uppercase truncate">
                Gestion des Archives
              </p>
            </div>
          )}
        </div>
      </div>

      <SidebarContent className="px-2 py-3">
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-muted text-[10px] uppercase tracking-widest mb-1 px-3">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNav.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-lg transition-all duration-200"
                      activeClassName="bg-sidebar-primary/15 text-sidebar-primary font-semibold border-l-2 border-sidebar-primary"
                    >
                      <item.icon className="mr-2.5 h-4 w-4 shrink-0" />
                      {!collapsed && <span className="truncate">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mx-3 my-2 h-px bg-sidebar-border" />

        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-muted text-[10px] uppercase tracking-widest mb-1 px-3">
            Administration
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminNav.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-lg transition-all duration-200"
                      activeClassName="bg-sidebar-primary/15 text-sidebar-primary font-semibold border-l-2 border-sidebar-primary"
                    >
                      <item.icon className="mr-2.5 h-4 w-4 shrink-0" />
                      {!collapsed && <span className="truncate">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-3">
        {!collapsed && (
          <button
            onClick={() => navigate("/profil")}
            className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-sidebar-accent transition-colors mb-1 group"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-sidebar-primary/30 to-sidebar-primary/10 flex items-center justify-center text-sidebar-primary text-xs font-bold ring-1 ring-sidebar-primary/20">
              AB
            </div>
            <div className="text-left min-w-0 flex-1">
              <p className="text-xs font-semibold text-sidebar-accent-foreground truncate group-hover:text-sidebar-primary transition-colors">Ahmed Benali</p>
              <p className="text-[10px] text-sidebar-muted truncate">Administrateur</p>
            </div>
          </button>
        )}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => navigate("/")}
              className="text-destructive/80 hover:bg-destructive/10 hover:text-destructive rounded-lg"
            >
              <LogOut className="mr-2.5 h-4 w-4" />
              {!collapsed && <span>Déconnexion</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
