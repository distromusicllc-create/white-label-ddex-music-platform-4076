import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Releases from "./pages/Releases";
import NewRelease from "./pages/NewRelease";
import ReleaseDetail from "./pages/ReleaseDetail";
import DeliveryPipeline from "./pages/DeliveryPipeline";
import Analytics from "./pages/Analytics";
import Earnings from "./pages/Earnings";
import Settings from "./pages/Settings";
import SpotifyPitching from "./pages/SpotifyPitching";
import HelpSupport from "./pages/HelpSupport";
import ProtectedRoute from "./pages/ProtectedRoute";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/dashboard/releases" element={<ProtectedRoute><Releases /></ProtectedRoute>} />
            <Route path="/dashboard/releases/new" element={<ProtectedRoute><NewRelease /></ProtectedRoute>} />
            <Route path="/dashboard/releases/:id" element={<ProtectedRoute><ReleaseDetail /></ProtectedRoute>} />
            <Route path="/dashboard/releases/:id/distribution" element={<ProtectedRoute><DeliveryPipeline /></ProtectedRoute>} />
            <Route path="/dashboard/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
            <Route path="/dashboard/earnings" element={<ProtectedRoute><Earnings /></ProtectedRoute>} />
            <Route path="/dashboard/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/dashboard/spotify-pitching" element={<ProtectedRoute><SpotifyPitching /></ProtectedRoute>} />
            <Route path="/dashboard/help" element={<ProtectedRoute><HelpSupport /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
