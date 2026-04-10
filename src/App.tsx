import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import MenuPage from "./pages/MenuPage";
import GamePage from "./pages/GamePage";
import CollectionPage from "./pages/CollectionPage";
import DeckPage from "./pages/DeckPage";
import ShopPage from "./pages/ShopPage";
import CampaignPage from "./pages/CampaignPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MenuPage />} />
          <Route path="/game" element={<GamePage />} />
          <Route path="/collection" element={<CollectionPage />} />
          <Route path="/deck" element={<DeckPage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/campaign" element={<CampaignPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
