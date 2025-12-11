import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Landing from "./pages/Landing";
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedLanding = () => {
  const [hasWallet, setHasWallet] = useState<boolean | null>(null);

  useEffect(() => {
    const walletCreated = localStorage.getItem('walletCreated');
    const userId = localStorage.getItem('userId');
    const walletSeed = localStorage.getItem('walletSeed');
    
    setHasWallet(walletCreated === 'true' && !!userId && !!walletSeed);
  }, []);

  if (hasWallet === null) {
    return <div className="min-h-screen bg-background" />;
  }

  if (hasWallet) {
    return <Navigate to="/app" replace />;
  }

  return <Landing />;
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<ProtectedLanding />} />
            <Route path="/app" element={<Index />} />
            <Route path="/admin" element={<Admin />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;