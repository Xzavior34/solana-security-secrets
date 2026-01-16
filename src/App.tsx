import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavigationBar from "@/components/NavigationBar";
import LandingPage from "@/pages/LandingPage";
import ScenarioPage from "@/pages/ScenarioPage";
import CodeExplorerPage from "@/pages/CodeExplorerPage";
import ExploitPage from "@/pages/ExploitPage";
import FixPage from "@/pages/FixPage";
import TestsPage from "@/pages/TestsPage";
import DownloadPage from "@/pages/DownloadPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <NavigationBar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/scenario" element={<ScenarioPage />} />
          <Route path="/code" element={<CodeExplorerPage />} />
          <Route path="/exploit" element={<ExploitPage />} />
          <Route path="/fix" element={<FixPage />} />
          <Route path="/tests" element={<TestsPage />} />
          <Route path="/download" element={<DownloadPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
