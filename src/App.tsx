import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Archives from "./pages/Archives";
import Emplacements from "./pages/Emplacements";
import Utilisateurs from "./pages/Utilisateurs";
import Historique from "./pages/Historique";
import Scanner from "./pages/Scanner";
import Profil from "./pages/Profil";
import Roles from "./pages/Roles";
import ArchiveTypes from "./pages/ArchiveTypes";
import NotFound from "./pages/NotFound";
import { AppLayout } from "./components/AppLayout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/archives" element={<Archives />} />
            <Route path="/emplacements" element={<Emplacements />} />
            <Route path="/scanner" element={<Scanner />} />
            <Route path="/historique" element={<Historique />} />
            <Route path="/utilisateurs" element={<Utilisateurs />} />
            <Route path="/roles" element={<Roles />} />
            <Route path="/types-archive" element={<ArchiveTypes />} />
            <Route path="/profil" element={<Profil />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
