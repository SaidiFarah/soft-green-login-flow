import {
  LayoutDashboard, Archive, MapPin, Users, History, ScanBarcode,
  User, LogOut, ChevronDown, ShieldCheck,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation, useNavigate } from "react-router-dom";
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
      {/* Header */}
      <div className="p-4 flex items-center gap-3 border-b border-sidebar-border">
        <img src={logo} alt="El Mazraa" className={`${collapsed ? "h-8" : "h-10"} w-auto`} />
        {!collapsed && (
          <div className="min-w-0">
            <p className="text-sm font-bold text-sidebar-accent-foreground font-heading truncate">El Mazraa</p>
            <p className="text-[10px] text-sidebar-muted truncate">Gestion des Archives</p>
          </div>
        )}
      </div>

      <SidebarContent className="px-2 py-3">
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-muted text-[10px] uppercase tracking-widest mb-1">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNav.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-lg transition-colors"
                      activeClassName="bg-sidebar-accent text-sidebar-primary font-semibold"
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

        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-muted text-[10px] uppercase tracking-widest mb-1">Administration</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminNav.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-lg transition-colors"
                      activeClassName="bg-sidebar-accent text-sidebar-primary font-semibold"
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
            className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-sidebar-accent transition-colors mb-1"
          >
            <div className="w-8 h-8 rounded-full bg-sidebar-primary/20 flex items-center justify-center text-sidebar-primary text-xs font-bold">AB</div>
            <div className="text-left min-w-0 flex-1">
              <p className="text-xs font-medium text-sidebar-accent-foreground truncate">Ahmed Benali</p>
              <p className="text-[10px] text-sidebar-muted truncate">Admin</p>
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
