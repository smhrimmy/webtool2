import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ScanProvider } from "@/context/ScanContext";
import MainLayout from "@/components/MainLayout";

// Pages
import Diagnostics from "./pages/Diagnostics";
import ErrorAnalysisPage from "./pages/ErrorAnalysisPage";
import CMSAnalysis from "./pages/CMSAnalysis";
import EmailHealth from "./pages/EmailHealth";
import Tools from "./pages/Tools";
import Documentation from "./pages/Documentation";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <ScanProvider>
        <BrowserRouter>
          <MainLayout>
            <Routes>
              <Route path="/" element={<Diagnostics />} />
              <Route path="/error-analysis" element={<ErrorAnalysisPage />} />
              <Route path="/cms-analysis" element={<CMSAnalysis />} />
              <Route path="/email-health" element={<EmailHealth />} />
              <Route path="/tools" element={<Tools />} />
              <Route path="/documentation" element={<Documentation />} />
              
              {/* Legacy redirects or aliases if needed */}
              <Route path="/wordpress" element={<Navigate to="/cms-analysis" replace />} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </MainLayout>
        </BrowserRouter>
      </ScanProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
